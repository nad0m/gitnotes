import axios from 'axios'
import { Buffer } from 'buffer'
import dayjs from 'dayjs'
import { CategoryItem, IAuthState, NoteItem, SyncPayload } from '../types'
import { Method } from '../types/enums'
import { initialNotes } from './data/initialNotes'

export const REPO_NAME = 'gitnotes-database'

export const SDK = (
  method: Method,
  path: string,
  accessToken: string,
  data?: Object
) => {
  const apiHost = 'https://api.github.com'

  return axios({
    method,
    url: `${apiHost}${path}`,
    data,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
}

export const getGitHubUsername = async (
  accessToken: string
): Promise<string | null> => {
  try {
    const user = await SDK(Method.GET, `/user`, accessToken)
    return user.data?.login ?? null
  } catch (error) {
    console.error(error)
    return null
  }
}

export const Queries = {
  getCategoriesAndNotes: async ({
    accessToken,
    username
  }: {
    accessToken: string
    username: string
  }): Promise<SyncPayload | undefined> => {
    try {
      const [{ data: categoryData }, { data: noteData }] = await Promise.all([
        SDK(
          Method.GET,
          `/repos/${username}/${REPO_NAME}/contents/categoryItems.json`,
          accessToken
        ),
        SDK(
          Method.GET,
          `/repos/${username}/${REPO_NAME}/contents/noteItems.json`,
          accessToken
        )
      ])

      const categories = Buffer.from(categoryData.content, 'base64').toString()
      const notes = Buffer.from(noteData.content, 'base64').toString()

      try {
        const categoryItems = JSON.parse(categories) as CategoryItem[]
        const noteItems = JSON.parse(notes) as NoteItem[]
        return {
          categoryItems,
          noteItems
        }
      } catch (error) {
        console.error(error)
      }
    } catch (error) {
      console.error(error)
    }
  },
  getCategories: async (
    accessToken: string
  ): Promise<CategoryItem[] | undefined> => {
    const username = await getGitHubUsername(accessToken)
    try {
      const { data } = await SDK(
        Method.GET,
        `/repos/${username}/${REPO_NAME}/contents/categoryItems.json`,
        accessToken
      )

      const notes = Buffer.from(data.content, 'base64').toString()

      try {
        const result = JSON.parse(notes)
        return result as CategoryItem[]
      } catch (error) {
        console.error(error)
      }
    } catch (error) {
      console.error(error)
    }
  },
  getNotes: async (accessToken: string): Promise<NoteItem[] | undefined> => {
    const username = await getGitHubUsername(accessToken)
    try {
      const { data } = await SDK(
        Method.GET,
        `/repos/${username}/${REPO_NAME}/contents/noteItems.json`,
        accessToken
      )

      const notes = Buffer.from(data.content, 'base64').toString()

      try {
        const result = JSON.parse(notes)
        return result as NoteItem[]
      } catch (error) {
        console.error(error)
      }
    } catch (error) {
      console.error(error)
    }
  }
}

export const Mutations = {
  firstTimeLoginCheck: async (
    username: string,
    accessToken: string
  ): Promise<boolean> => {
    try {
      await SDK(Method.GET, `/repos/${username}/${REPO_NAME}`, accessToken)
      return false
    } catch (error) {
      return true
    }
  },
  createAtomicNotesDataRepo: async (accessToken: string): Promise<void> => {
    const atomicNotesDataRepo = {
      name: REPO_NAME,
      description: 'Database of notes for GitNotes',
      private: true,
      visibility: 'private',
      has_issues: false,
      has_projects: false,
      has_wiki: false,
      is_template: false,
      auto_init: false,
      allow_squash_merge: false,
      allow_rebase_merge: false
    }
    try {
      await SDK(Method.POST, `/user/repos`, accessToken, atomicNotesDataRepo)
    } catch (error) {
      console.error(error)
    }
  },

  createInitialCommit: async (
    username: string,
    accessToken: string
  ): Promise<void> => {
    const noteCommit = {
      message: 'Initial commit',
      content: Buffer.from(JSON.stringify([initialNotes], null, 2)).toString(
        'base64'
      ),
      branch: 'master'
    }
    try {
      await SDK(
        Method.PUT,
        `/repos/${username}/${REPO_NAME}/contents/notes.json`,
        accessToken,
        noteCommit
      )
    } catch (error: unknown) {
      console.error(error)
    }
  },
  syncData: async (options: {
    data: SyncPayload
    authState: IAuthState
    username: string
  }) => {
    const { data, authState, username } = options
    const noteItems = data.noteItems
    const categoryItems = data.categoryItems
    const accessToken = authState.token

    try {
      // Get a reference
      // https://docs.github.com/en/free-pro-team@latest/rest/reference/git#update-a-reference
      const ref = await SDK(
        Method.GET,
        `/repos/${username}/${REPO_NAME}/git/refs/heads/master`,
        accessToken
      )

      // Create blobs
      // https://docs.github.com/en/free-pro-team@latest/rest/reference/git#create-a-blob
      const [noteBlob, categoryBlob] = await Promise.all([
        SDK(
          Method.POST,
          `/repos/${username}/${REPO_NAME}/git/blobs`,
          accessToken,
          {
            content: JSON.stringify(noteItems, null, 2)
          }
        ),
        SDK(
          Method.POST,
          `/repos/${username}/${REPO_NAME}/git/blobs`,
          accessToken,
          {
            content: JSON.stringify(categoryItems, null, 2)
          }
        )
      ])

      // Create tree path
      const treeItems = [
        {
          path: 'noteItems.json',
          sha: noteBlob.data.sha,
          mode: '100644',
          type: 'blob'
        },
        {
          path: 'categoryItems.json',
          sha: categoryBlob.data.sha,
          mode: '100644',
          type: 'blob'
        }
      ]

      // Create tree
      // https://docs.github.com/en/free-pro-team@latest/rest/reference/git#create-a-tree
      const tree = await SDK(
        Method.POST,
        `/repos/${username}/${REPO_NAME}/git/trees`,
        accessToken,
        {
          tree: treeItems,
          base_tree: ref.data.object.sha
        }
      )

      // Create commit
      // https://docs.github.com/en/free-pro-team@latest/rest/reference/git#create-a-commit
      const commit = await SDK(
        Method.POST,
        `/repos/${username}/${REPO_NAME}/git/commits`,
        accessToken,
        {
          message: `GitNotes update ${dayjs(Date.now()).format(
            'h:mm A M/D/YYYY'
          )}`,
          tree: tree.data.sha,
          parents: [ref.data.object.sha]
        }
      )

      // Update a reference
      // https://docs.github.com/en/free-pro-team@latest/rest/reference/git#update-a-reference
      await SDK(
        Method.POST,
        `/repos/${username}/${REPO_NAME}/git/refs/heads/master`,
        accessToken,
        {
          sha: commit.data.sha,
          force: true
        }
      )
    } catch (error) {}
  }
}

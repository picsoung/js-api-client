import { isMemberPropValid, createMemberPatchQuery } from './utils'

export default http => ({
  list: args => getWorkspaces(http, args),
  get: args => getWorkspace(http, args),
  add: args => addWorkspace(http, args),
  update: args => updateWorkspace(http, args),
  delete: args => deleteWorkspace(http, args),
  addMembers: args => addMembers(http, args),
  removeMembers: args => removeMembers(http, args)
})

const getWorkspaces = (http, { search, page, pageSize } = {}) => {
  return http.request({
    method: 'get',
    url: '/workspaces',
    params: {
      page,
      page_size: pageSize,
      search
    }
  })
}

const getWorkspace = (http, { id }) => {
  return http.request({
    method: 'get',
    url: `/workspaces/${id}`
  })
}

const addWorkspace = (http, { name }) => {
  if (name === undefined) {
    throw `A name is required`
  }

  return http.request({
    method: 'post',
    url: `/workspaces`
  })
}

const updateWorkspace = (http, { id, data } = {}) => {
  return http.request({
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'patch',
    url: `/workspaces/${id}`,
    data
  })
}

const addMembers = (http, { id, members }) => {
  if (!isMemberPropValid(members)) {
    throw `No member provided`
  }

  const membersToAdd = !Array.isArray(members) ? [members] : members
  const membersQuery = createMemberPatchQuery({
    members: membersToAdd,
    operation: 'add'
  })

  return updateWorkspace(http, { id, data: membersQuery })
}

const removeMembers = (http, { id, members }) => {
  if (!isMemberPropValid(members)) {
    throw `No member provided`
  }

  const membersToAdd = !Array.isArray(members) ? [members] : members
  const membersQuery = createMemberPatchQuery({
    members: membersToAdd,
    operation: 'remove'
  })

  return updateWorkspace(http, { id, data: membersQuery })
}

const deleteWorkspace = (http, { id }) => {
  return http.request({
    method: 'delete',
    url: `/workspaces/${id}`
  })
}

export const getWorkspaceForms = (
  http,
  { id, fromId, page, pageSize } = {}
) => {
  return http.request({
    method: 'get',
    url: `/workspaces/${id}/forms`,
    params: {
      page,
      page_size: pageSize,
      from_id: fromId
    }
  })
}

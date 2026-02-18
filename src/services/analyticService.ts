import type { Overview } from '~/types/analytic'
import type { APIResponse } from '~/types/common'
import * as request from '~/utils/axiosClient'

export const getOverview = async (): Promise<APIResponse<Overview>> => {
    const response = await request.get('/analytics/overview')
    return response.data
}

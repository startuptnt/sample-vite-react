import { fetchUtils } from 'ra-core';
import simpleRestProvider from 'ra-data-simple-rest';
import authProvider from './Auth0AuthProvider';

const httpClient = async (url, options = {}) => {

    const accessToken = await authProvider.getToken();

    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }

    if (accessToken) {
        options.headers.set('Authorization', `Bearer ${accessToken}`);
    }

    return fetchUtils.fetchJson(url, options);
};

const limitOffsetPaginationProvider = (apiUrl) => {
    const baseProvider = simpleRestProvider(apiUrl, httpClient);

    return {
        ...baseProvider,

        getList: async (resource, params) => {
            const { page, perPage } = params.pagination;
            const { field, order } = params.sort;
           
            const query = {
                limit: perPage,
                offset: (page - 1) * perPage,
                ordering: order === 'ASC' ? field : `-${field}`,
                ...fetchUtils.flattenObject(params.filter),
            };

            const url = `${apiUrl}/${resource}/?${fetchUtils.queryParameters(query)}`;
            const { json } = await httpClient(url);

            if (!json.results || typeof json.count !== 'number') {
                throw new Error('Invalid API response format.');
            }

            return {
                data: json.results,
                total: json.count,
            };
        },

        getOne: baseProvider.getOne,
        getMany: async (resource, params) => {
            const query = {
                id__in: params.ids.join(','), 
            };
        
            const url = `${apiUrl}/${resource}?${fetchUtils.queryParameters(query)}`;
            const { json } = await httpClient(url);
        
            if (!json.results || !Array.isArray(json.results)) {
                throw new Error('Invalid API response format. Ensure the API uses Django filtering with id__in.');
            }
        
            return {
                data: json.results.map((item) => ({
                    ...item,
                })),
            };
        },
        getManyReference: async (resource, params) => {
            const { page, perPage } = params.pagination;
            const { field, order } = params.sort;
            const enhancedFilter = {
                ...params.filter,
                [params.target]: params.id
            };
           
            const query = {
                limit: perPage,
                offset: (page - 1) * perPage,
                ordering: order === 'ASC' ? field : `-${field}`,
                ...fetchUtils.flattenObject(enhancedFilter),
            };

            const url = `${apiUrl}/${resource}/?${fetchUtils.queryParameters(query)}`;
            const { json } = await httpClient(url);

            if (!json.results || typeof json.count !== 'number') {
                throw new Error('Invalid API response format.');
            }

            return {
                data: json.results,
                total: json.count,
            };
        },
        // getManyReference: baseProvider.getManyReference,
        create: baseProvider.create,
        update: baseProvider.update,
        updateMany: baseProvider.updateMany,
        delete: baseProvider.delete,
        deleteMany: baseProvider.deleteMany,
    };
};

export default limitOffsetPaginationProvider;
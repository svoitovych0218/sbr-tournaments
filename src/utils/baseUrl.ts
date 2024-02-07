const urls: Record<string, string> = {
    dev: 'https://dev-api.battle-royale.site/api',
    stage: 'https://stage-api.battle-royale.site/api',
    production: 'https://production-api.battle-royale.site/api'
}


export const getBaseUrl = (env: string) => {
    return urls[env];
}
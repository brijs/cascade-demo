import { MedplumClient } from '@medplum/core';

class MedplumClientSingleton {
    private static instance: MedplumClient;

    private constructor() { }

    public static getInstance(): MedplumClient {
        if (!MedplumClientSingleton.instance) {
            MedplumClientSingleton.instance = new MedplumClient({
                clientId: process.env.MEDPLUM_CLIENT_ID,
                clientSecret: process.env.MEDPLUM_CLIENT_SECRET,
                baseUrl: process.env.MEDPLUM_API_BASE_URL,
            });
        }
        return MedplumClientSingleton.instance;
    }
}

export default MedplumClientSingleton;

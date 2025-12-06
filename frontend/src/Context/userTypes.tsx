export enum LanguageEnum {
    EN = "en",
    CN = "cn",
}

export interface User {
    id: number;
    username: string;
    password: string;
    name: string;
    weixinId: string;
    email: string;
    phone_number: string;
    campus: number;
    preferedLanguage: LanguageEnum;
}

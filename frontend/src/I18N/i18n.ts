import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    en: {
        translation: {
            app_name: "EduPost",

            landing: {
                welcome: "Welcome to EduPost",
                tagline: "You want to post or announce something to other students? Join us now.",
                description: "This platform is designed to facilitate communication and sharing among students.",
                or: "OR",

                create_account_btn: "Create an account",
                login_btn: "Login",
            },

            signup: {
                title: "Inscription",
                subtitle: "Create your account to access the platform.",

                name: "Name",
                username: "Username",
                email: "EMail",
                password: "Password",
                confirm_password: "Confirm Password",
                phone_number: "Phone Number",
                wechat_id: "WeChat ID",

                placeholder_name: "Your name",
                placeholder_username: "Your username",
                placeholder_email: "Your email",
                placeholder_password: "Your password",
                placeholder_confirm_password: "Confirm your password",
                placeholder_phone: "Your phone number",
                placeholder_wechat_id: "Your WeChat ID",

                submit_btn: "Create the account",

                login_link_prefix: "Already have an account?",
                login_link: "Log in here.",
            },

            login: {
                title: "Connection",
                subtitle: "Connect to your account to access the platform.",
                
                username: "Username",
                password: "Password",

                submit_btn: "Sign In",

                signup_link_prefix: "No account?",
                signup_link: "Sign up here.",
            },
        }
    },
    cn: {
        translation: {
            app_name: "学苑贴",

            landing: {
                welcome: "欢迎来到 学苑贴",
                tagline: "想向其他学生发布或宣布些什么？立即加入我们。",
                description: "本平台旨在促进学生之间的交流和分享。",
                or: "或",

                create_account_btn: "创建账号",
                login_btn: "登录",
            },

            signup: {
                title: "注册",
                subtitle: "创建您的账户以访问平台。",

                name: "姓名",
                username: "用户名",
                email: "电子邮件",
                password: "密码",
                confirm_password: "确认密码",
                phone_number: "电话号码",
                wechat_id: "微信ID",

                placeholder_name: "您的姓名",
                placeholder_username: "您的用户名",
                placeholder_email: "您的电子邮件",
                placeholder_password: "您的密码",
                placeholder_confirm_password: "确认您的密码",
                placeholder_phone: "您的电话号码",
                placeholder_wechat_id: "您的微信ID",

                submit_btn: "创建账户",

                login_link_prefix: "已有账户?",
                login_link: "在此登录。",
            },

            login: {
                title: "登录",
                subtitle: "连接您的账户以访问平台。",

                username: "用户名",
                password: "密码",

                submit_btn: "登录",

                signup_link_prefix: "没有账户?",
                signup_link: "在此注册。",
            },
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en", // Default language

        interpolation: {
            escapeValue: false
        },
        // Fallback locale if a specific key is missing
        fallbackLng: "en",
        // Use 'translation' as the default namespace
        ns: ["translation"],
        defaultNS: "translation"
    });

export default i18n;
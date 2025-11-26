import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    en: {
        translation: {
            app_name: "EduPost",

            language: {
                english: "EN",
                chinese: "中文",
            },

            or: "OR",

            header : {
                'profile': "Profile",
                'logout': "Logout",
            },

            no_access: {
                title: "Access Denied",
                subtitle: "You need to be authenticated to access this page.",
                description: "This platform requires user authentication to ensure secure access to your personal content.",
                login_prompt: "Please log in first.",
            },

            landing: {
                'welcome-to': "Welcome to",
                tagline: "You want to post or announce something to other students?",
                'join-us-now': "Join us now.",
                description: "This platform is designed to facilitate communication and sharing among students.",

                create_account_btn: "Create an account",
                login_btn: "Login",
            },

            signup: {
                title: "Inscription",
                subtitle: "Create your account to access the",
                plateform: "platform.",

                name: "Name",
                username: "Username",
                email: "Email",
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
                subtitle: "Connect to your account to access the",
                plateform: "platform.",

                username: "Username",
                password: "Password",

                submit_btn: "Sign In",

                signup_link_prefix: "No account?",
                signup_link: "Sign up here.",
            },

            errors: {
                all_fields_required: "All fields are required.",
                invalid_email: "Invalid email format.",
                invalid_phone: "Phone number must be 11 digits.",
                weak_password: "Password must be at least 8 characters long and contain at least one digit.",
                passwords_do_not_match: "Passwords do not match.",
                generic_signup_error: "An error occurred during signup, please try again.",
                generic_login_error: "An error occurred during login, please try again.",
                login_fields_required: "All fields are required to login.",
                invalid_credentials: "Invalid username or password.",
                account_inactive: "Your account is inactive. Please contact support.",
            },
            success: {
                signup_successful: "Signup successful! You can now log in.",
                welcome_back: "Welcome back",
            }
        }
    },
    cn: {
        translation: {
            app_name: "学苑贴",

            language: {
                english: "EN",
                chinese: "中文",
            },

            or: "或",

            header : {
                'profile': "个人资料",
                'logout': "登出",
            },

            no_access: {
                title: "禁止访问",
                subtitle: "您需要登录才能访问此页面。",
                description: "本平台要求用户进行身份验证，以确保安全访问您的个人内容。",
                login_prompt: "请先登录。",
            },

            landing: {
                'welcome-to': "欢迎来到",
                tagline: "想向其他学生发布或宣布些什么？",
                'join-us-now': "现在就加入我们吧。",
                description: "本平台旨在促进学生之间的交流和分享。",

                create_account_btn: "创建账号",
                login_btn: "登录",
            },

            signup: {
                title: "注册",
                subtitle: "创建您的账户以访问",
                plateform: "平台。",

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
                subtitle: "登录您的账户以访问",
                plateform: "平台。",

                username: "用户名",
                password: "密码",

                submit_btn: "登录",

                signup_link_prefix: "没有账户?",
                signup_link: "在此注册。",
            },

            errors: {
                all_fields_required: "所有字段都是必需的。",
                invalid_email: "电子邮件格式无效。",
                invalid_phone: "电话号码必须是11位数字。",
                weak_password: "密码必须至少8个字符长，并包含至少一位数字。",
                passwords_do_not_match: "密码不匹配。",
                generic_signup_error: "注册过程中发生错误，请重试。",
                generic_login_error: "登录过程中发生错误，请重试。",
                login_fields_required: "所有字段都是必需的，才能登录。",
                invalid_credentials: "用户名或密码无效。",
                account_inactive: "您的账户处于非活动状态。请联系支持人员。",
            },
            success: {
                signup_successful: "注册成功！您现在可以登录了。",
                welcome_back: "欢迎回来",
            }
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en",

        interpolation: {
            escapeValue: false
        },
        fallbackLng: "en",
        ns: ["translation"],
        defaultNS: "translation"
    });

export default i18n;
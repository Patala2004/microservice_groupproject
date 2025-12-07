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

      // --- Landing & Auth ---
      landing: {
        "welcome-to": "Welcome to",
        tagline: "You want to post or announce something to other students?",
        "join-us-now": "Join us now.",
        description:
            "This platform is designed to facilitate communication and sharing among students.",
        create_account_btn: "Register",
        login_btn: "Login",
      },
      register: {
        title: "Register",
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
        signup_link: "Register here.",
      },
      errors: {
        all_fields_required: "All fields are required.",
        invalid_email: "Invalid email format.",
        invalid_phone: "Phone number must be 11 digits.",
        weak_password:
            "Password must be at least 8 characters long and contain at least one digit.",
        passwords_do_not_match: "Passwords do not match.",
        generic_signup_error:
            "An error occurred during registration, please try again.",
        generic_login_error:
            "An error occurred during login, please try again.",
        login_fields_required: "All fields are required to login.",
        invalid_credentials: "Invalid username or password.",
        account_inactive: "Your account is inactive. Please contact support.",
      },
      success: {
        signup_successful: "Registration successful! You can now log in.",
        welcome_back: "Welcome back",
      },

      // --- Home Page ---
      home: {
        trending_topics: "Trending Topics",
        search_placeholder: "Search...",
        no_posts: "No posts found.",
        guest_list_label: "Guest List",
      },
      sort: {
        recent: "Recent",
        popular: "Popular",
        recommended: "For You",
      },
      filters: {
        all: "All",
        sell: "Selling",
        buy: "Buying",
        activity: "Activity",
        sport: "Sport",
      },
      post_type: {
        sell: "Selling",
        buy: "Buying",
        activity: "Activity",
        sport: "Sport",
      },
      post_actions: {
        hosting: "Hosting",
        join: "Join",
        joined: "Joined",
        leave: "Leave Event",
        contact: "Contact Seller",
        joined_count: "{{count}} joined",
        be_first: "Be the first to join!",
        like: "Like",
        comment: "Comment",
      },
      dashboard: {
        welcome: "Welcome back!",
        new_post_btn: "New Post",
        stat_posts: "Posts",
        stat_likes: "Likes",
        stat_events: "Events",
      },
      create_modal: {
        title: "Create Post",
        label_category: "Category",
        label_title: "Title",
        label_content: "Content",
        label_type: "Type",
        label_price: "Price",
        label_location: "Location",
        label_image: "Image",
        submit_btn: "Post",
        header_title: "Add New Post",
        placeholder_title: "e.g. Selling Calculus Textbook",
        placeholder_content: "Provide details...",
        placeholder_price: "Free / $20",
        placeholder_location: "e.g. Library",
        
      },
      profile: {
        title: "My Profile",
        subtitle: "Manage your personal information",
        save_btn: "Save Changes",
        cancel_btn: "Cancel",
        avatar_label: "Profile Picture",
        change_avatar: "Change Photo",
        personal_info: "Personal Information",
        security: "Security",
        update_password: "Update Password",
        current_password: "Current Password",
        new_password: "New Password",
        upload_success: "Profile picture updated successfully",
        update_success: "Profile updated successfully",
        personal_info_desc: "Update your contact details and public information.",
        update_password_desc: "Ensure your account uses a strong password.",

        default_name: "Your name",
        default_email: "Your email",
        default_phone: "Your phone number",
        default_weixin: "Your WeChat ID",
      },
    },
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
        "welcome-to": "欢迎来到",
        tagline: "想向其他学生发布或宣布些什么？",
        "join-us-now": "现在就加入我们吧。",
        description: "本平台旨在促进学生之间的交流和分享。",
        create_account_btn: "注册",
        login_btn: "登录",
      },
      register: {
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
      },

      // --- Home Page ---
      home: {
        trending_topics: "热门话题",
        search_placeholder: "搜索...",
        no_posts: "没有找到相关帖子。",
        guest_list_label: "嘉宾名单",
      },
      sort: {
        recent: "最新",
        popular: "热门",
        recommended: "推荐",
      },
      filters: {
        all: "全部",
        sell: "出售",
        buy: "求购",
        activity: "活动",
        sport: "运动",
      },
      post_type: {
        sell: "出售",
        buy: "求购",
        activity: "活动",
        sport: "运动",
      },
      post_actions: {
        hosting: "我发起的",
        join: "加入",
        joined: "已加入",
        leave: "退出",
        contact: "联系卖家",
        joined_count: "{{count}} 人已加入",
        be_first: "成为第一个加入的人！",
        like: "点赞",
        comment: "评论",
      },
      dashboard: {
        welcome: "欢迎回来!",
        new_post_btn: "发布新帖",
        stat_posts: "帖子",
        stat_likes: "获赞",
        stat_events: "活动",
      },
      create_modal: {
        title: "发布帖子",
        label_category: "分类",
        label_title: "标题",
        label_content: "描述",
        label_type: "类型",
        label_price: "价格",
        label_location: "地点",
        label_image: "图片",
        header_title: "添加新帖子",
        submit_btn: "发布",
        placeholder_title: "例如：出售微积分课本",
        placeholder_content: "提供详细信息...",
        placeholder_price: "免费 / 20元",
        placeholder_location: "例如：图书馆",
      },
      profile: {
        title: "我的个人资料",
        subtitle: "管理您的个人信息",
        save_btn: "保存更改",
        cancel_btn: "取消",
        avatar_label: "头像",
        change_avatar: "更换照片",
        personal_info: "个人信息",
        security: "安全设置",
        update_password: "修改密码",
        current_password: "当前密码",
        new_password: "新密码",
        upload_success: "头像更新成功",
        update_success: "资料更新成功",
        update_password_desc: "确保您的账户使用强密码。",
        personal_info_desc: "更新您的联系方式和公开信息。",

        default_name: "您的姓名",
        default_email: "您的邮箱",
        default_phone: "您的电话号码",
        default_weixin: "您的微信ID",
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",

  interpolation: {
    escapeValue: false,
  },
  fallbackLng: "en",
  ns: ["translation"],
  defaultNS: "translation",
});

export default i18n;
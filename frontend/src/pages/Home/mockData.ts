// mockData.ts

// --- TYPE DEFINITIONS ---
export type PostCategory = 'sell' | 'buy' | 'activity' | 'transport';

export interface Post {
    id: number;
    type: PostCategory;
    title: string;
    user: string;
    initials: string;
    content: string;
    price?: string; // Optional because not all posts have a price
    location?: string; // Optional
    date: string;
    likes: number;
    comments: number;
    attendees: string[];
}

export interface Recommendation {
    id: number;
    name: string;
    count: number;
}

// --- CONSTANTS ---
export const CURRENT_USER = "Me"; 

// --- FAKE DATA ---
export const FAKE_RECOMMENDATIONS: Recommendation[] = [
    { id: 1, name: "CS Study Group", count: 128 },
    { id: 2, name: "Used Furniture", count: 45 },
    { id: 3, name: "Carpooling", count: 32 },
    { id: 4, name: "Campus Jobs", count: 18 },
];

export const FAKE_POSTS: Post[] = [
    { 
        id: 1, 
        type: 'sell', 
        title: "MacBook Pro M1 (2020) - Great Condition", 
        user: "David Chen", 
        initials: "DC",
        content: "Upgrading to a newer model. No scratches, battery health at 92%. Comes with original charger.", 
        price: "$800",
        location: "North Campus Dorms",
        date: "20 mins ago", 
        likes: 12, 
        comments: 3,
        attendees: [] 
    },
    { 
        id: 2, 
        type: 'sell', 
        title: "Calculus Early Transcendentals (8th Ed)", 
        user: "Sarah Jenkins", 
        initials: "SJ",
        content: "Required for MATH 101/102. Some highlighting inside but otherwise good.", 
        price: "$30",
        location: "Library",
        date: "2 hours ago", 
        likes: 5, 
        comments: 1,
        attendees: [] 
    },
    { 
        id: 3, 
        type: 'activity', 
        title: "Friday Night Basketball 🏀", 
        user: "Mike Ross", 
        initials: "MR",
        content: "Booking the court at the Rec center from 6pm to 8pm. We need 3 more people for full court 5v5.", 
        price: "Free",
        location: "Rec Center Court 2",
        date: "3 hours ago", 
        likes: 24, 
        comments: 8,
        attendees: ["John D.", "Chris P.", "Alex T."] 
    },
    { 
        id: 4, 
        type: 'activity', 
        title: "Hackathon Team Formation", 
        user: CURRENT_USER, 
        initials: "ME",
        content: "Looking for a backend developer and a designer for the upcoming Campus Hackathon. MERN stack preferred.", 
        price: "Free",
        location: "Engineering Hall",
        date: "5 hours ago", 
        likes: 15, 
        comments: 4,
        attendees: ["Jessica L.", "Tom H."] 
    },
    { 
        id: 5, 
        type: 'transport', 
        title: "Ride to Downtown / Train Station", 
        user: "Emily White", 
        initials: "EW",
        content: "Driving to the central train station this Friday afternoon around 4 PM. Have space for 2 people + luggage.", 
        price: "$5 (Gas)",
        location: "Pick up at Student Union",
        date: "1 day ago", 
        likes: 8, 
        comments: 2,
        attendees: ["Me"] 
    },
    { 
        id: 6, 
        type: 'buy', 
        title: "ISO: Scientific Calculator", 
        user: "Tom Holland", 
        initials: "TH",
        content: "Lost my TI-84. Does anyone have one they are selling cheap or lending for the semester?", 
        price: "Budget: $50",
        location: "Anywhere on campus",
        date: "1 day ago", 
        likes: 3, 
        comments: 5,
        attendees: [] 
    },
     { 
        id: 7, 
        type: 'activity', 
        title: "Beginner Yoga Session", 
        user: "Yoga Club", 
        initials: "YC",
        content: "Open session on the quad. Bring your own mat! Snacks provided after.", 
        price: "Free",
        location: "Main Quad",
        date: "2 days ago", 
        likes: 45, 
        comments: 12,
        attendees: ["Alice", "Bob", "Charlie", "David"] 
    },
];
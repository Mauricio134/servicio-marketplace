const API_URL = import.meta.env.VITE_API_URL || "https://servicio-marketplace.onrender.com/api";

/* =========================
   TYPES
========================= */

export interface User {
  id: string;
  name: string;
  email: string;
  whatsapp?: string | null;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Post {
  id: string;
  title: string;
  description: string;
  type: "REQUEST" | "SERVICE";
  minBudget: number | null;
  maxBudget: number | null;
  location: string | null;
  status?: "ACTIVE" | "CLOSED";
  createdAt?: string;
  user?: User;
  estimatedTime?: number | null;
}

export interface Offer {
  id: string;
  price: number;
  estimatedTime: number;
  message: string;
  status:
    | "PENDING"
    | "INTERESTED"
    | "REJECTED"
    | "ACCEPTED";
  createdAt?: string;
  updatedAt?: string;
  postId: string;
  userId: string;
  user: User;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  whatsapp: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface CreatePostData {
  title: string;
  description: string;
  type: "REQUEST" | "SERVICE";
  minBudget?: number;
  maxBudget?: number;
  estimatedTime?: number;
  location?: string;
}

export interface CreateOfferData {
  price: number;
  estimatedTime: number;
  message: string;
}

/* =========================
   HELPER
========================= */

async function handleResponse(
  response: Response,
) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Something went wrong",
    );
  }

  return data;
}

/* =========================
   AUTH
========================= */

export async function registerUser(
  data: RegisterData,
): Promise<AuthResponse> {
  const response = await fetch(
    `${API_URL}/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  return handleResponse(response);
}

export async function loginUser(
  data: LoginData,
): Promise<AuthResponse> {
  const response = await fetch(
    `${API_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  return handleResponse(response);
}

/* =========================
   POSTS
========================= */

export async function getPosts(): Promise<
  Post[]
> {
  const response = await fetch(
    `${API_URL}/posts`,
  );

  return handleResponse(response);
}

export async function getPostById(
  postId: string,
): Promise<Post> {
  const response = await fetch(
    `${API_URL}/posts/${postId}`,
  );

  return handleResponse(response);
}

export async function createPost(
  data: CreatePostData,
  token: string,
): Promise<Post> {
  const response = await fetch(
    `${API_URL}/posts`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    },
  );

  return handleResponse(response);
}

/* =========================
   OFFERS
========================= */

export async function createOffer(
  postId: string,
  data: CreateOfferData,
  token: string,
): Promise<Offer> {
  const response = await fetch(
    `${API_URL}/offers`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...data,
        postId,
      }),
    },
  );

  return handleResponse(response);
}

export async function getOffers(
  postId: string,
  token: string,
): Promise<Offer[]> {
  const response = await fetch(
    `${API_URL}/offers/post/${postId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return handleResponse(response);
}

export async function cancelOfferInterest(
  offerId: string,
  token: string,
): Promise<Offer> {
  const response = await fetch(
    `${API_URL}/offers/${offerId}/cancel-interest`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return handleResponse(response);
}

export async function acceptOffer(
  offerId: string,
  token: string,
): Promise<Offer> {
  const response = await fetch(
    `${API_URL}/offers/${offerId}/accept`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return handleResponse(response);
}

export async function markOfferAsInteresting(
  offerId: string,
  token: string,
): Promise<Offer> {
  const response = await fetch(
    `${API_URL}/offers/${offerId}/interest`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return handleResponse(response);
}


/* =========================
   NOTIFICATIONS
========================= */

export interface Notification {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
  userId: string;
  type: "OFFER_ACCEPTED";

  offer?: {
    id: string;
    price: number;
    estimatedTime: number;
    message: string;
    status:
      | "PENDING"
      | "INTERESTED"
      | "REJECTED"
      | "ACCEPTED";

    post: {
      id: string;
      title: string;
      description: string;
    };

    user: {
      id: string;
      name: string;
      email: string;
      whatsapp?: string | null;
    };
  } | null;
}

export async function getNotifications(
  token: string,
): Promise<Notification[]> {
  const response = await fetch(
    `${API_URL}/notifications`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return handleResponse(response);
}

export async function markNotificationAsRead(
  notificationId: string,
  token: string,
): Promise<Notification> {
  const response = await fetch(
    `${API_URL}/notifications/${notificationId}/read`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return handleResponse(response);
}

export async function markAllNotificationsAsRead(
  token: string,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/notifications/read-all`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return handleResponse(response);
}

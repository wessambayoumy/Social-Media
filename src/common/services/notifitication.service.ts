import admin from "firebase-admin";
import { readFileSync } from "node:fs";

class NotificationService {
  private readonly client: admin.app.App;
  constructor() {
    const serviceAccount = JSON.parse(
      readFileSync("./config/firebase.service.account.json", "utf-8"),
    );
    this.client = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
  async sendOneNotification({
    token,
    data,
  }: {
    token: string;
    data: { title: string; body: string };
  }) {
    try {
      const message = {
        data,
        token,
      };
      await this.client.messaging().send(message);
    } catch (error) {
      console.error(error);
    }
  }
  async sendManyNotifications({
    tokens,
    data,
  }: {
    tokens: string[];
    data: { title: string; body: string };
  }) {
    await Promise.allSettled(
      tokens.map((token) => this.sendOneNotification({ token, data })),
    );
  }
}

export default new NotificationService();

export class FoodPostModel {
    userId: string;

    title: string;

    description?: string;

    timeEstimate?: number;

    foodTagIds: string[];

    srcImages?: string[];
}

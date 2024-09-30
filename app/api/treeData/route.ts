'use server'
import { getTreeNodes } from "@/app/services/menu";
export async function GET() {
    try {
        const res = await getTreeNodes();
        return Response.json(res);
    } catch (error) {
        return error
    }
   
}
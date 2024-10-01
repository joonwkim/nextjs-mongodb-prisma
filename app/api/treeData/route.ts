'use server'
import { getTreeNodes } from "@/app/services/menu";
export async function GET() {
    try {
        const res = await getTreeNodes();
        console.log('api get', res)
        return Response.json(res.props?.treeNodes);
    } catch (error) {
        return error
    }

}
'use server'
import prisma from "@/prisma/prisma";

export async function getTreeNodes() {
    try {
        const treeNodes = await prisma.treeNode.findMany({
            include: {
                parent: true,
                children:true,
            }
           
        });
        return treeNodes;
    } catch (error) {
        return ({ error });
    }
}
import { archiveCategory } from "@/lib/api/categories";
import useSwitch from "@/lib/hooks/useSwitch";
import Button from "@/molecules/buttons/button";
import ConfirmModal from "@/molecules/modals/confirm-modal";
import { Category } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

type ArchiveCategoryModalProps = {
    button?: React.ReactNode;
    category: Category;
    method: "archive" | "unarchive";
}

export default function ArchiveCategoryModal(props: ArchiveCategoryModalProps) {
    const sw = useSwitch(false);
    const client = useQueryClient();
    const mutation = useMutation({
        mutationFn: archiveCategory, onSuccess: () => {
            toast.success(`Transaction ${props.method === "archive" ? "archived" : "unarchived"} successfully`);
            client.invalidateQueries({ queryKey: ["categories"] });
            sw.setFalse();
        }, onError: (error) => {
            toast.error(error.message);
        }
    });

    return (
        <>
            {
                props?.button ? (
                    <div onClick={sw.setTrue}>
                        {props.button}
                    </div>
                ) : (
                    <Button color="violet" title={props.method === "archive" ? "Archive" : "Unarchive"} onClick={sw.setTrue} />
                )
            }
            <ConfirmModal title={props.method === "archive" ? "Archive Category" : "Unarchive Category"} isOpen={sw.state} onClose={sw.setFalse} onConfirm={async () => {
                await mutation.mutateAsync({
                    id: props.category.id,
                    archived: props.method === "archive"
                });
            }} >
                Are you sure you want to {props.method === "archive" ? "archive" : "unarchive"} this category?
            </ConfirmModal>
        </>
    )
}
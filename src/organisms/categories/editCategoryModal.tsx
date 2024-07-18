import { EditCategoryData, updateCategory } from "@/lib/api/categories";
import useEditObject from "@/lib/hooks/useEditObject";
import useSwitch from "@/lib/hooks/useSwitch";
import Button from "@/molecules/buttons/button";
import Modal from "@/molecules/modals/modal";
import { Category } from "@prisma/client";
import { TextInput } from "@tremor/react";
import toast from "react-hot-toast";

type EditCategoryModalProps = {
    button?: React.ReactNode;
    category: Category;
}

export default function EditCategoryMdoal(props: EditCategoryModalProps) {
    const sw = useSwitch(false);
    const updateMutation = useEditObject<EditCategoryData>({ mutationFn: updateCategory, initialData: {
        title: props.category.title,
        description: props.category.description,
        id: props.category.id
    }, invalidateQueries: { queryKey: ["categories"] } });

    const canEdit = updateMutation.data?.description != props.category.description || updateMutation.data?.title != props.category.title;
    return (
        <>
            {
                props?.button ? (
                    <div onClick={sw.setTrue}>
                        {props.button}
                    </div>
                ) : (
                    <Button color="violet" title="Edit Category" onClick={sw.setTrue} />
                )
            }
            <Modal isOpen={sw.state} onClose={sw.setFalse} title="Edit Category" footer={
                <div className="flex justify-start gap-2">
                    <Button color="violet" size="sm" title="Edit"
                        onClick={async () => {
                            try {
                                await updateMutation.mutate(true)
                                toast.success("Category edited successfully")
                                sw.setFalse()
                            } catch (error: any) {
                                toast.error(error.message)
                            }
                        }}
                        loading={updateMutation.isPending}
                        disabled={!canEdit} />
                    <Button color="slate" size="sm" title="Cancel"
                        onClick={sw.setFalse}
                        disabled={updateMutation.isPending} />
                </div>
            }>
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Title
                    </label>
                    <TextInput id="title" name="title" placeholder="Title" value={updateMutation.data.title} onValueChange={(e) => updateMutation.setProperty("title", e)} />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <TextInput id="description" name="description" placeholder="Description" value={updateMutation.data.description} onValueChange={(e) => updateMutation.setProperty("description", e)} />
                </div>
            </Modal>
        </>
    )
}
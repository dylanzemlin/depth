import { CreateCategoryData, createCategory } from "@/lib/api/categories";
import useEditObject from "@/lib/hooks/useEditObject";
import useSwitch from "@/lib/hooks/useSwitch";
import Button from "@/molecules/buttons/button";
import Modal from "@/molecules/modals/modal";
import { TextInput } from "@tremor/react";
import toast from "react-hot-toast";

type CreateCategoryModalProps = {
    button?: React.ReactNode;
}

export default function CreateCategoryModal(props?: CreateCategoryModalProps) {
    const sw = useSwitch(false);
    const createMutation = useEditObject<CreateCategoryData>({ mutationFn: createCategory, initialData: {}, invalidateQueries: { queryKey: ["categories"] } });

    const canCreate = createMutation.data?.description != null && createMutation.data?.title != null;
    return (
        <>
            {
                props?.button ? (
                    <div onClick={sw.setTrue}>
                        {props.button}
                    </div>
                ) : (
                    <Button color="violet" title="Create Category" onClick={sw.setTrue} />
                )
            }
            <Modal isOpen={sw.state} onClose={sw.setFalse} title="Create Category" footer={
                <div className="flex justify-start gap-2">
                    <Button color="violet" size="sm" title="Create"
                        onClick={async () => {
                            try {
                                await createMutation.mutate(true)
                                toast.success("Category created successfully")
                                sw.setFalse()
                            } catch (error: any) {
                                toast.error(error.message)
                            }
                        }}
                        loading={createMutation.isPending}
                        disabled={!canCreate} />
                    <Button color="slate" size="sm" title="Cancel"
                        onClick={sw.setFalse}
                        disabled={createMutation.isPending} />
                </div>
            }>
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Title
                    </label>
                    <TextInput id="title" name="title" placeholder="Title" value={createMutation.data.title} onValueChange={(e) => createMutation.setProperty("title", e)} />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <TextInput id="description" name="description" placeholder="Description" value={createMutation.data.description} onValueChange={(e) => createMutation.setProperty("description", e)} />
                </div>
            </Modal>
        </>
    )
}
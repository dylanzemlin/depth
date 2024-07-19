import { CreateBudgetData, createBudget } from "@/lib/api/budgets";
import useEditObject from "@/lib/hooks/useEditObject";
import useSwitch from "@/lib/hooks/useSwitch";
import Button from "@/molecules/buttons/button";
import Modal from "@/molecules/modals/modal";
import { Category } from "@prisma/client";
import { DatePicker, NumberInput, Select, SelectItem, TextInput } from "@tremor/react";
import toast from "react-hot-toast";

type CreateBudgetModalProps = {
    button?: React.ReactNode;
    categories: Category[];
}

export default function CreateBudgetModal(props: CreateBudgetModalProps) {
    const sw = useSwitch(false);
    const createMutation = useEditObject<CreateBudgetData>({ mutationFn: createBudget, initialData: {
        startDate: new Date()
    }, invalidateQueries: { queryKey: ["budgets"] } });

    console.log(createMutation.data);
    const canCreate = createMutation.data?.description != null && (createMutation.data?.goal != null && createMutation.data?.goal > 0) && createMutation.data?.categoryId != null && createMutation.data?.startDate != null
    return (
        <>
            {
                props?.button ? (
                    <div onClick={sw.setTrue}>
                        {props.button}
                    </div>
                ) : (
                    <Button color="violet" title="Create Budget" onClick={sw.setTrue} />
                )
            }
            <Modal isOpen={sw.state} onClose={sw.setFalse} title="Create Budget" footer={
                <div className="flex justify-start gap-2">
                    <Button color="violet" size="sm" title="Create"
                        onClick={async () => {
                            try {
                                await createMutation.mutate(true)
                                toast.success("Budget created successfully")
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
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <TextInput id="description" name="description" placeholder="Description" value={createMutation.data.description} onValueChange={(e) => createMutation.setProperty("description", e)} />
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Category
                    </label>
                    <Select id="category" name="category" value={createMutation.data.categoryId} onValueChange={(e) => createMutation.setProperty("categoryId", e)}>
                        {
                            props?.categories?.filter(x => !x.archived)?.map((category) => {
                                return (
                                    <SelectItem key={category.id} value={category.id}>
                                        {category.title}
                                    </SelectItem>
                                )
                            })
                        }
                    </Select>
                </div>
                <div>
                    <label htmlFor="goal" className="block text-sm font-medium text-gray-700">
                        Goal
                    </label>
                    <NumberInput id="goal" name="goal" placeholder="Amount" value={createMutation.data.goal} onValueChange={(e) => createMutation.setProperty("goal", e)} enableStepper={false} />
                </div>
                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                        Start Date
                    </label>
                    <DatePicker id="startDate" placeholder="Start Date" value={createMutation.data.startDate} onValueChange={(e) => createMutation.setProperty("startDate", e)} />
                </div>
                <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                        End Date
                    </label>
                    <DatePicker id="endDate" placeholder="End Date" value={createMutation.data.endDate} onValueChange={(e) => createMutation.setProperty("endDate", e)} />
                </div>
            </Modal>
        </>
    )
}
import { EditBudgetData, editBudget } from "@/lib/api/budgets";
import useEditObject from "@/lib/hooks/useEditObject";
import useSwitch from "@/lib/hooks/useSwitch";
import Button from "@/molecules/buttons/button";
import Modal from "@/molecules/modals/modal";
import { Budget, Category } from "@prisma/client";
import { DatePicker, NumberInput, Select, SelectItem, TextInput } from "@tremor/react";
import { DateTime } from "luxon";
import toast from "react-hot-toast";

type EditBudgetModalProps = {
    button?: React.ReactNode;
    categories: Category[];
    budget: Budget;
}

export default function EditBudgetModal(props: EditBudgetModalProps) {
    const sw = useSwitch(false);
    const updateMutation = useEditObject<EditBudgetData>({ mutationFn: editBudget, initialData: {
        startDate: DateTime.fromJSDate(new Date(props.budget.startDate)),
        endDate: props.budget.endDate ? DateTime.fromJSDate(new Date(props.budget.endDate)) : undefined,
        categoryId: props.budget.categoryId,
        description: props.budget.description,
        goal: props.budget.goal,
        id: props.budget.id
    }, invalidateQueries: { queryKey: ["budgets"] } });

    const canSave = updateMutation.data?.description != props.budget.description ||
        updateMutation.data?.goal != props.budget.goal ||
        updateMutation.data?.categoryId != props.budget.categoryId;
        // updateMutation.data?.startDate != props.budget.startDate ||
        // updateMutation.data?.endDate != props.budget.endDate;
    return (
        <>
            {
                props?.button ? (
                    <div onClick={sw.setTrue}>
                        {props.button}
                    </div>
                ) : (
                    <Button color="violet" title="Update Budget" onClick={sw.setTrue} />
                )
            }
            <Modal isOpen={sw.state} onClose={sw.setFalse} title="Update Budget" footer={
                <div className="flex justify-start gap-2">
                    <Button color="violet" size="sm" title="Save"
                        onClick={async () => {
                            try {
                                await updateMutation.mutate(true)
                                toast.success("Budget updated successfully")
                                sw.setFalse()
                            } catch (error: any) {
                                toast.error(error.message)
                            }
                        }}
                        loading={updateMutation.isPending}
                        disabled={!canSave} />
                    <Button color="slate" size="sm" title="Cancel"
                        onClick={sw.setFalse}
                        disabled={updateMutation.isPending} />
                </div>
            }>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <TextInput id="description" name="description" placeholder="Description" value={updateMutation.data.description} onValueChange={(e) => updateMutation.setProperty("description", e)} />
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Category
                    </label>
                    <Select id="category" name="category" value={updateMutation.data.categoryId} onValueChange={(e) => updateMutation.setProperty("categoryId", e)}>
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
                    <NumberInput id="goal" name="goal" placeholder="Amount" value={updateMutation.data.goal} onValueChange={(e) => updateMutation.setProperty("goal", e)} enableStepper={false} />
                </div>
                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                        Start Date
                    </label>
                    <DatePicker id="startDate" placeholder="Start Date" value={updateMutation.data.startDate?.toJSDate()} onValueChange={(e) => updateMutation.setProperty("startDate", DateTime.fromISO(e?.toISOString() ?? DateTime.local().toISO()))} />
                </div>
                <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                        End Date
                    </label>
                    <DatePicker id="endDate" placeholder="End Date" value={updateMutation.data.endDate?.toJSDate()} onValueChange={(e) => updateMutation.setProperty("endDate", DateTime.fromISO(e?.toISOString() ?? DateTime.local().toISO()))} />
                </div>
            </Modal>
        </>
    )
}
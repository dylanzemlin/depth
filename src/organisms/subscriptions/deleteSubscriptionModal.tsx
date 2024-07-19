import { deleteSubscription } from "@/lib/api/subscriptions";
import useSwitch from "@/lib/hooks/useSwitch";
import Button from "@/molecules/buttons/button";
import ConfirmModal from "@/molecules/modals/confirm-modal";
import { Subscription } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

type DeleteSubscriptionModalProps = {
    button?: React.ReactNode;
    subscription: Subscription;
}

export default function DeleteSubscriptionModal(props: DeleteSubscriptionModalProps) {
    const sw = useSwitch(false);
    const client = useQueryClient();
    const mutation = useMutation({ mutationFn: deleteSubscription, onSuccess: () => {
        toast.success("Subscriptions deleted");
        client.invalidateQueries({ queryKey: ["subscriptions"] });
        sw.setFalse();
    }, onError: (error) => {
        toast.error(error.message);
    } });

    return (
        <>
            {
                props?.button ? (
                    <div onClick={sw.setTrue}>
                        {props.button}
                    </div>
                ) : (
                    <Button color="violet" title="Delete Subscription" onClick={sw.setTrue} />
                )
            }
            <ConfirmModal title="Delete Subscription" isOpen={sw.state} onClose={sw.setFalse} onConfirm={async () => await mutation.mutateAsync(props.subscription.id) } loading={mutation.isPending} >
                Are you sure you want to delete this subscription? This action <span className="text-red-500 font-bold">cannot</span> be undone and all transactions related to this subscription <span className="text-red-500 font-bold">will</span> be deleted.
            </ConfirmModal>
        </>
    )
}
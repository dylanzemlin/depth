"use client";

import Button from "@/molecules/buttons/button";
import IconButton from "@/molecules/buttons/icon-button";
import Loading from "@/molecules/loading";
import ConfirmModal from "@/molecules/modals/confirm-modal";
import Modal from "@/molecules/modals/modal";
import { Popover, PopoverContent, PopoverTrigger } from "@/molecules/popover";
import { NumberInput, TextInput } from "@tremor/react";
import React from "react";
import { FaAngleLeft, FaAngleRight, FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";

export default function Login() {
    const [isOpenA, setIsOpenA] = React.useState(false);
    const [isOpenB, setIsOpenB] = React.useState(false);

    return (
        <main className="flex min-h-screen w-full gap-4 p-4 bg-slate-100 flex-col">
            <h3 className="text-2xl font-semibold text-gray-900">
                Buttons
            </h3>

            <div className="flex gap-2">
                <Button color="red" title="Button" />
                <Button color="blue" title="Button" />
                <Button color="green" title="Button" />
                <Button color="violet" title="Button" />
            </div>

            <div className="flex gap-2">
                <Button color="red" title="Button" outline />
                <Button color="blue" title="Button" outline />
                <Button color="green" title="Button" outline />
                <Button color="violet" title="Button" outline />
            </div>

            <div className="flex gap-2">
                <IconButton>
                    <FaAnglesLeft />
                </IconButton>
                <IconButton>
                    <FaAngleLeft />
                </IconButton>
                <IconButton>
                    <FaAngleRight />
                </IconButton>
                <IconButton>
                    <FaAnglesRight />
                </IconButton>
            </div>

            <div className="flex gap-2">
                <IconButton color="red">
                    <FaAnglesLeft />
                </IconButton>
                <IconButton color="blue">
                    <FaAngleLeft />
                </IconButton>
                <IconButton color="green">
                    <FaAngleRight />
                </IconButton>
                <IconButton color="violet">
                    <FaAnglesRight />
                </IconButton>
            </div>

            <h3 className="text-2xl font-semibold text-gray-900">
                Modals
            </h3>
            <div className="flex gap-2">
                <Button color="red" title="Open Modal" size="sm" onClick={() => setIsOpenA(true)} />
                <Modal title="Test Modal" isOpen={isOpenA} onClose={() => setIsOpenA(false)}>
                    <TextInput title="Name" />
                    <NumberInput title="Age" />
                </Modal>

                <Button color="blue" title="Open Confirm Modal" size="sm" onClick={() => setIsOpenB(true)} />
                <ConfirmModal title="Confirm" isOpen={isOpenB} onClose={() => setIsOpenB(false)} onConfirm={async () => setIsOpenB(false)}>
                    <p>
                        Are you sure you want to delete this item?
                    </p>
                </ConfirmModal>
            </div>

            <h3 className="text-2xl font-semibold text-gray-900">
                Other
            </h3>
            <div className="flex">
                <div className="w-8 h-8">
                    <Loading />
                </div>

                <Popover>
                    <PopoverTrigger>
                        <Button title="Open Popover" />
                    </PopoverTrigger>

                    <PopoverContent>
                        Hello World
                    </PopoverContent>
                </Popover>
            </div>
        </main>
    );
}

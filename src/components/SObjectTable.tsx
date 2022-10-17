import { Table } from "flowbite-react";
import React from "react";

const SObjectTable = () => {
    return (
        <section className="container mx-auto mt-20  mb-20 items-center justify-between">
            <div className="relative h-[36rem] overflow-x-auto shadow-md dark:bg-gray-800">
                <Table hoverable={true}>
                    <Table.Head>
                        <Table.HeadCell className="!p-4">R/O</Table.HeadCell>
                        <Table.HeadCell>M</Table.HeadCell>
                        <Table.HeadCell>Name</Table.HeadCell>
                        <Table.HeadCell>Description</Table.HeadCell>
                        <Table.HeadCell>Helptext</Table.HeadCell>
                        <Table.HeadCell>API Name</Table.HeadCell>
                        <Table.HeadCell>Type</Table.HeadCell>
                        <Table.HeadCell>Value/Formula</Table.HeadCell>
                    </Table.Head>
                    {/* <Table.Body className="divide-y">{getRowItem()}</Table.Body> */}
                </Table>
            </div>
        </section>
    );
};

export default SObjectTable;

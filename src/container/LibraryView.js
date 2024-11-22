import { Button, Form, notification, Table, Typography } from "antd";
import { useEffect, useMemo, useState } from "react";
import RenderModalForm from "../components/renderModalForm";
import RenderForm from "../components/renderForm";
import { useQueries, useQuery } from 'react-query';
import { addBook, editBookok, getBooks, removeBook } from "../services/apiRequest";

export default function LibraryView() {

    const [isOpenModal, setIsOpenModal] = useState(false);

    const [recordId, setRecordId] = useState(null);

    const [adding, setAdding] = useState(false);

    const [form] = Form.useForm();

    const columns = [
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
        },
        {
            title: 'Tác giả',
            dataIndex: 'author',
        },
        {
            title: 'Cân nặng',
            dataIndex: 'weight',
        },
        {
            title: 'Dung lượng',
            dataIndex: 'fileSize',
        },
        {
            title: 'Năm xuất bản',
            dataIndex: 'year',
        },
        {
            title: "Hành động",
            render: (_, record) => (
                <div className="gap-3 flex">
                    <Button
                        onClick={() => {
                            // setEditBookId(record.id);
                            // setIsEditMode(true);
                            setIsOpenModal(true);

                            form.setFieldsValue({
                                title: record.title,
                                author: record.author,
                                year: record.year,
                                weight: record.weight,
                                type: record.weight ? 2 : 1,
                                fileSize: record.fileSize
                            });

                            setAdding(false);

                            setRecordId(record.id);

                            if (record.weight) {
                                setWatchType(2)
                            } else {
                                setWatchType(1)
                            }
                        }}
                    >
                        Sửa
                    </Button>
                    <Button
                        danger
                        onClick={() => removeBook({ id: record?.id }).then(result => {
                            refetch()
                        })}
                    >
                        Xóa
                    </Button>
                </div>
            ),
        },
    ];

    const [watchType, setWatchType] = useState(null);

    const setUpFormModal = [
        {
            name: 'title',
            type: 'input',
            lg: 12,
            label: 'Tiêu đề',
            rules: [{ required: true }],
        },
        {
            name: 'author',
            type: 'input',
            lg: 12,
            label: 'Tác giả',
            rules: [{ required: true }],
        },
        {
            name: 'type',
            type: 'select',
            lg: 12,
            label: 'Loại sách',
            rules: [{ required: true }],
            options: [{ label: "Sách điện tử", value: 1 }, { label: "Sách in", value: 2 }],
            onChange: (e) => {
                setWatchType(e);
            },
        },
        ...(watchType == 2 ? [
            {
                name: 'weight',
                type: 'input',
                lg: 12,
                label: 'Cân nặng',
                rules: [{ required: true }],
            },
        ] : watchType == 1 ? [
            {
                name: 'fileSize',
                type: 'input',
                lg: 12,
                label: 'Dung lượng',
                rules: [{ required: true }],
            },
        ] : []),
        {
            name: 'year',
            type: 'number',
            lg: 12,
            label: 'Năm xuất bản',
            rules: [{ required: true }],
        }
    ];

    const setUpFormModalSearch = [
        {
            name: 'title',
            type: 'input',
            lg: 8,
            label: 'Tiêu đề',
            // rules: [{ required: true }],
        },
        {
            name: 'author',
            type: 'input',
            lg: 8,
            label: 'Tác giả',
            // rules: [{ required: true }],
        },
        {
            name: 'weight',
            type: 'input',
            lg: 8,
            label: 'Cân nặng',
            // rules: [{ required: true }],
        },
        {
            name: 'fileSize',
            type: 'input',
            lg: 8,
            label: 'Dung lượng',
            // rules: [{ required: true }],
        },
        {
            name: 'year',
            type: 'input',
            lg: 8,
            label: 'Năm xuất bản',
            // rules: [{ required: true }],
        },
        {
            type: "html",
            lg: 3,
        }
    ];

    const { data: dataBook, refetch, isLoading } = useQuery(
        ['data'],
        () => getBooks()
    );


    const data = useMemo(() => {
        return dataBook?.data || [];
    }, [dataBook]);

    async function add(params) {
        await addBook(params);
        refetch();
        notification.success({ message: "Đã thêm thành công" });
    }

    return (
        <>
            <RenderModalForm
                form={form}
                fields={setUpFormModal}
                isOpenModal={isOpenModal}
                handleCloseModal={() => {
                    setIsOpenModal(false);
                }}
                onFinish={(values) => {
                    if (adding) {
                        add(values)
                    } else {
                        editBookok(Object.assign({}, values, { id: recordId })).then(result => {
                            refetch();
                            setIsOpenModal(false);
                            notification.success({ message: "Đã sửa xong" });
                        })
                    }
                }}
            />

            <div className="flex flex-col gap-3">
                <Typography.Title level={3} className="w-full flex justify-center">
                    THƯ VIỆN
                </Typography.Title>

                <div className="flex justify-end">
                    <Button type="primary"
                        onClick={() => {
                            setIsOpenModal(true);
                            setAdding(true);
                        }}
                    >
                        Thêm sách
                    </Button>
                </div>

                <div>
                    {/* <RenderForm
                        fields={setUpFormModalSearch}
                        footer={<></>}
                    /> */}
                </div>

                <Table
                    columns={columns}
                    dataSource={data}
                />
            </div>
        </>
    )
}
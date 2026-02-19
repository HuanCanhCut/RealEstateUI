import { useState } from 'react'
import ReactModal from 'react-modal'
import { EditIcon, PlusIcon, TrashIcon, XIcon } from 'lucide-react'
import { toast } from 'sonner'

import { useQuery } from '@tanstack/react-query'
import Button from '~/components/Button'
import ConfirmModal from '~/components/ConfirmModal'
import Input from '~/components/Input'
import PopperWrapper from '~/components/PopperWrapper'
import { queryClient } from '~/lib/queryClient'
import * as categoryService from '~/services/categoryService'
import type { CategoryModel } from '~/types/category'
import handleApiError from '~/utils/handleApiError'

const CategoryManager = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [modalType, setModalType] = useState<'create' | 'update'>('create')
    const [name, setName] = useState('')
    const [categoryId, setCategoryId] = useState<number | null>(null)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: () => categoryService.getCategories(1, 10),
    })

    const handleOpenModal = (type: 'create' | 'update') => {
        setIsOpen(true)
        setModalType(type)
        setCategoryId(null)
    }

    const handleCloseModal = () => {
        setIsOpen(false)
    }

    const handleSubmit = async (name: string) => {
        try {
            switch (modalType) {
                case 'create':
                    await categoryService.createCategory(name)

                    toast.success('Danh mục đã được tạo thành công')

                    break
                case 'update':
                    if (categoryId) {
                        await categoryService.updateCategory(categoryId, name)

                        toast.success('Danh mục đã được cập nhật thành công')
                    }

                    break
            }

            queryClient.invalidateQueries({ queryKey: ['categories'] })

            setName('')

            handleCloseModal()
        } catch (error) {
            handleApiError({ error })
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()

            handleSubmit(name)
        }
    }

    const handleDeleteCategory = async (categoryId: number) => {
        try {
            await categoryService.deleteCategory(categoryId)

            toast.success('Danh mục đã được xóa thành công')
        } catch (error) {
            handleApiError({ error })
        }
    }

    return (
        <div>
            <ReactModal
                ariaHideApp={false}
                isOpen={isOpen}
                overlayClassName="overlay"
                closeTimeoutMS={200}
                className="modal"
                shouldCloseOnOverlayClick={true}
                shouldCloseOnEsc={true}
                onRequestClose={handleCloseModal}
                onAfterClose={() => {
                    handleCloseModal()
                }}
            >
                <PopperWrapper className="relative max-w-[425px] overflow-y-auto p-6" onKeyDown={handleKeyDown}>
                    <h2 className="text-lg leading-none font-semibold">Quản lý danh mục</h2>
                    <p className="text-muted-foreground mt-2 text-sm">
                        Quản lý danh mục của bạn. Nhấn lưu khi hoàn tất.
                    </p>

                    <Button variant="ghost" size="icon" className="absolute top-3 right-3" onClick={handleCloseModal}>
                        <XIcon className="h-4 w-4" />
                    </Button>

                    <Input
                        placeholder="Tên danh mục"
                        className="mt-4"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <div className="mt-6 flex justify-end gap-3">
                        <Button type="button" onClick={handleCloseModal} variant={'outline'}>
                            Hủy
                        </Button>
                        <Button onClick={() => handleSubmit(name)}>
                            {modalType === 'create' ? 'Tạo' : 'Cập nhật'}
                        </Button>
                    </div>
                </PopperWrapper>
            </ReactModal>

            <ConfirmModal
                isOpen={isConfirmOpen}
                title="Bạn có chắc chắn?"
                content="Việc xóa danh mục này sẽ không thể khôi phục lại"
                confirmFn={async () => {
                    if (categoryId) {
                        await handleDeleteCategory(categoryId)

                        queryClient.invalidateQueries({ queryKey: ['categories'] })

                        setCategoryId(null)
                        setIsConfirmOpen(false)
                    }
                }}
                cancelFn={() => {
                    setIsConfirmOpen(false)
                }}
                onRequestClose={() => {
                    setIsConfirmOpen(false)
                }}
            />

            <div className="flex items-center justify-between">
                <p className="text-lg font-bold">Quản lý danh mục</p>

                <Button variant="ghost" size="icon" onClick={() => handleOpenModal('create')}>
                    <PlusIcon className="h-4 w-4" />
                </Button>
            </div>
            <div className="mt-4">
                {categories?.data.map((category: CategoryModel) => (
                    <div
                        key={category.id}
                        className="flex items-center justify-between rounded-md p-2 hover:bg-gray-100/80"
                    >
                        <p>{category.name}</p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                    handleOpenModal('update')
                                    setCategoryId(category.id)
                                    setName(category.name)
                                }}
                            >
                                <EditIcon className="h-4 w-4 text-green-500" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                    setCategoryId(category.id)
                                    setIsConfirmOpen(true)
                                }}
                            >
                                <TrashIcon className="h-4 w-4 text-red-500" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CategoryManager

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import ImageUpload from './components/ImageUpload'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import Button from '~/components/Button'
import Input from '~/components/Input'
import Label from '~/components/Label/Label'
import LocationSelect from '~/components/LocationSelect'
import { Textarea } from '~/components/Textarea/Textarea'
import * as categoryServices from '~/services/categoryService'
import * as postService from '~/services/postService'
import handleApiError from '~/utils/handleApiError'
import uploadToCloudinary from '~/utils/uploadToCloudinary'

interface Location {
    province: string
    district: string
    ward: string
}

interface FieldValue {
    category_id: string
    sub_locality: string
    administrative_address: string
    bedrooms: number
    bathrooms: number
    balcony: string
    main_door: string
    legal_documents: string
    interior_status: string
    area: number
    price: number
    deposit: number
    title: string
    description: string
}

const createPostSchema = z
    .object({
        category_id: z.string().min(1, 'Vui lòng chọn loại BDS'),
        sub_locality: z.string().min(1, 'Vui lòng chọn địa điểm'),
        administrative_address: z.string().min(1, 'Địa chỉ BDS không được để trống'),
        bedrooms: z
            .string()
            .min(1, 'Vui lòng nhập số phòng ngủ')
            .pipe(
                z.coerce.number({
                    error: 'Số phòng ngủ không hợp lệ',
                }),
            )
            .pipe(z.number().min(0, 'Số phòng ngủ phải lớn hơn hoặc bằng 0')),
        bathrooms: z
            .string()
            .min(1, 'Vui lòng nhập số phòng vệ sinh')
            .pipe(
                z.coerce.number({
                    error: 'Số phòng vệ sinh không hợp lệ',
                }),
            )
            .pipe(z.number().min(0, 'Số phòng vệ sinh phải lớn hơn hoặc bằng 0')),
        balcony: z.string().min(1, 'Vui lòng nhập thông tin'),
        main_door: z.string().min(1, 'Vui lòng nhập thông tin'),
        legal_documents: z.string().min(1, 'Giấy tờ pháp lý không được để trống'),
        interior_status: z.string().min(1, 'Vui lòng nhập thông tin'),
        area: z
            .string()
            .min(1, 'Vui lòng nhập diện tích')
            .pipe(
                z.coerce.number({
                    error: 'Diện tích không hợp lệ',
                }),
            )
            .pipe(z.number().min(1, 'Diện tích phải lớn hơn 0')),
        price: z
            .string()
            .min(1, 'Vui lòng nhập giá bán')
            .pipe(
                z.coerce.number({
                    error: 'Giá bán không hợp lệ',
                }),
            )
            .pipe(z.number().min(1, 'Giá bán phải lớn hơn 0')),
        deposit: z
            .string()
            .min(1, 'Vui lòng nhập số tiền cọc')
            .pipe(
                z.coerce.number({
                    error: 'Số tiền cọc không hợp lệ',
                }),
            )
            .pipe(z.number().min(1, 'Số tiền cọc phải lớn hơn 0')),
        title: z.string().min(1, 'Tiêu đề tin đăng không được để trống'),
        description: z.string().min(1, 'Mô tả chi tiết không được để trống'),
    })
    .refine((data) => data.deposit >= data.price * 0.1, {
        message: 'Số tiền cọc phải lớn hơn hoặc bằng 10% giá bán',
        path: ['deposit'],
    })
    .refine((data) => data.deposit <= data.price, {
        message: 'Số tiền cọc phải nhỏ hơn hoặc bằng giá bán',
        path: ['deposit'],
    })
    .refine((data) => data.administrative_address.split(' - ').length === 3, {
        message: 'Địa chỉ BDS phải có tỉnh, huyện, xã',
        path: ['administrative_address'],
    })

const CreatePost = () => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(createPostSchema),
        mode: 'onChange',
    })

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: () => categoryServices.getCategories(1, 100),
    })

    const [type, setType] = useState<'sell' | 'rent'>('sell')
    const [role, setRole] = useState<'personal' | 'agent'>('personal')
    const [files, setFiles] = useState<(File & { preview?: string })[]>([])

    const handleSelectType = (type: 'sell' | 'rent') => {
        setType(type)
    }

    const handleSubmitLocation = (location: Location) => {
        const addressArr = []

        for (const key in location) {
            if (location[key as keyof Location]) {
                addressArr.push(location[key as keyof Location])
            }
        }

        setValue('administrative_address', addressArr.reverse().join(' - '), {
            shouldValidate: true,
        })
    }

    const handleCreatePost = async (data: FieldValue) => {
        if (files.length === 0) {
            toast.error('Vui lòng tải lên ít nhất 1 hình ảnh')
            return
        }

        const toastId = toast.loading('Bài đăng của bạn đang được tải lên')

        try {
            // upload image to cloudinary
            const promises = await Promise.all(
                files.map((file) => {
                    // remove preview
                    delete file.preview

                    return uploadToCloudinary({ file, folder: 'real_estate/post', type: 'image' })
                }),
            )

            const images: string[] = promises.map((promise) => promise.secure_url)

            await postService.createPost({
                sub_locality: data.sub_locality,
                administrative_address: data.administrative_address,
                type,
                role,
                post_detail: {
                    bedrooms: data.bedrooms,
                    bathrooms: data.bathrooms,
                    balcony: data.balcony,
                    main_door: data.main_door,
                    legal_documents: data.legal_documents,
                    interior_status: data.interior_status,
                    area: data.area,
                    price: data.price,
                    deposit: data.deposit,
                },
                title: data.title,
                description: data.description,
                images,
                category_id: Number(data.category_id),
            })

            toast.success('Bài đăng của bạn đã được tạo thành công', {
                id: toastId,
            })
        } catch (error) {
            handleApiError({ error })
        }
    }

    return (
        <div className="container mx-auto mt-8 grid max-w-7xl grid-cols-12 gap-4 rounded-md bg-white p-2 pb-8 shadow-md">
            <ImageUpload setFiles={setFiles} files={files} />
            <div className="col-span-12 p-2 md:col-span-8 lg:col-span-9">
                <form className="flex flex-col gap-4" onSubmit={handleSubmit(handleCreatePost)}>
                    <div>
                        <Label title="Danh mục tin đăng" required />
                        <select
                            className="mt-2 w-full rounded-md border border-gray-300 p-2 outline-none"
                            {...register('category_id')}
                        >
                            {categories?.data.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <Label title="Danh mục bất động sản" required className="font-semibold"></Label>
                        <div className="mt-2 flex gap-2">
                            <Button
                                type="button"
                                onClick={() => handleSelectType('sell')}
                                variant={type === 'sell' ? 'default' : 'secondary'}
                            >
                                Cần bán
                            </Button>
                            <Button
                                type="button"
                                onClick={() => handleSelectType('rent')}
                                variant={type === 'rent' ? 'default' : 'secondary'}
                            >
                                Cho thuê
                            </Button>
                        </div>
                    </div>

                    <div className="mt-2 flex flex-col gap-2">
                        <Label title="Địa chỉ BDS" className="font-semibold" required />
                        <Input
                            className="bg-transparent"
                            placeholder="Tên toà nhà/khu dân cư/dự án"
                            {...register('sub_locality')}
                        />
                        {errors.sub_locality && (
                            <span className="text-error text-sm">{errors.sub_locality.message}</span>
                        )}
                    </div>

                    <div className="mt-2 flex gap-2">
                        <LocationSelect onSubmit={handleSubmitLocation} />
                        <div className="flex-1">
                            <Input
                                className="bg-transparent"
                                placeholder="Địa chỉ BDS*"
                                {...register('administrative_address')}
                            />
                            {errors.administrative_address && (
                                <span className="text-error text-sm">{errors.administrative_address.message}</span>
                            )}
                        </div>
                    </div>

                    <div className="mt-2 flex flex-col gap-4">
                        <Label title="Thông tin chi tiết" className="font-semibold" />

                        <div className="flex gap-2">
                            <div className="flex-1">
                                <Input
                                    className="bg-transparent"
                                    placeholder="Số phòng ngủ *"
                                    {...register('bedrooms')}
                                />
                                {errors.bedrooms && (
                                    <span className="text-error text-sm">{errors.bedrooms.message}</span>
                                )}
                            </div>
                            <div className="flex-1">
                                <Input
                                    className="bg-transparent"
                                    placeholder="Số phòng vệ sinh *"
                                    {...register('bathrooms')}
                                />
                                {errors.bathrooms && (
                                    <span className="text-error text-sm">{errors.bathrooms.message}</span>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <div className="flex-1">
                                <Input
                                    className="bg-transparent"
                                    placeholder="Hướng ban công *"
                                    {...register('balcony')}
                                />
                                {errors.balcony && <span className="text-error text-sm">{errors.balcony.message}</span>}
                            </div>
                            <div className="flex-1">
                                <Input
                                    className="bg-transparent"
                                    placeholder="Hướng cửa chính *"
                                    {...register('main_door')}
                                />
                                {errors.main_door && (
                                    <span className="text-error text-sm">{errors.main_door.message}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <Label title="Thông tin khác" className="font-semibold" />
                        <div className="mt-2 flex gap-2">
                            <div className="flex-1">
                                <Input
                                    className="bg-transparent"
                                    placeholder="Giấy tờ pháp lý *"
                                    {...register('legal_documents')}
                                />
                                {errors.legal_documents && (
                                    <span className="text-error text-sm">{errors.legal_documents.message}</span>
                                )}
                            </div>
                            <div className="flex-1">
                                <Input
                                    className="bg-transparent"
                                    placeholder="Tình trạng nội thất *"
                                    {...register('interior_status')}
                                />
                                {errors.interior_status && (
                                    <span className="text-error text-sm">{errors.interior_status.message}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-2 flex flex-col gap-2">
                        <Label title="Diện tích & giá" className="font-semibold" />
                        <Input className="bg-transparent" placeholder="Diện tích(m²) *" {...register('area')} />
                        {errors.area && <span className="text-error text-sm">{errors.area.message}</span>}
                        <Input className="bg-transparent" placeholder="Giá bán *" {...register('price')} />
                        {errors.price && <span className="text-error text-sm">{errors.price.message}</span>}
                        <Input className="bg-transparent" placeholder="Số tiền cọc*" {...register('deposit')} />
                        {errors.deposit && <span className="text-error text-sm">{errors.deposit.message}</span>}
                    </div>

                    <div className="mt-2 flex flex-col gap-2">
                        <Label title="Tiêu đề tin đăng và Mô tả chi tiết" className="font-semibold" />
                        <Input className="bg-transparent" placeholder="Tiêu đề tin đăng *" {...register('title')} />
                        {errors.title && <span className="text-error text-sm">{errors.title.message}</span>}
                        <Textarea placeholder="Mô tả chi tiết *" className="mt-2 h-36" {...register('description')} />
                        {errors.description && <span className="text-error text-sm">{errors.description.message}</span>}
                    </div>

                    <div>
                        <Label title="Bạn là" />
                        <div className="mt-2 flex gap-2">
                            <Button
                                type="button"
                                onClick={() => setRole('personal')}
                                variant={role === 'personal' ? 'default' : 'secondary'}
                            >
                                Người bán
                            </Button>
                            <Button
                                type="button"
                                onClick={() => setRole('agent')}
                                variant={role === 'agent' ? 'default' : 'secondary'}
                            >
                                Môi giới
                            </Button>
                        </div>
                    </div>

                    <Button type="submit" className="mt-6 w-full">
                        Đăng tin
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default CreatePost

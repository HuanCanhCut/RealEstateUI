import { Camera, X } from 'lucide-react'

import Label from '~/components/Label'
import { cn } from '~/utils/cn'

interface ImageUploadProps {
    setFiles: React.Dispatch<
        React.SetStateAction<
            (File & {
                preview?: string
            })[]
        >
    >
    files: File[]
    imagePreview: string[]
    setImagePreview: React.Dispatch<React.SetStateAction<string[]>>
}

const ImageUpload: React.FC<ImageUploadProps> = ({ files, setFiles, imagePreview, setImagePreview }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(e.target.files || [])

        setFiles([
            ...files,
            ...newFiles.map((file: File) => {
                return file
            }),
        ])

        setImagePreview((prev) => [...prev, ...newFiles.map((file) => URL.createObjectURL(file))])

        // allow user to upload multiple images same name
        e.target.value = ''
    }

    const handleRemove = (index: number) => {
        setFiles(files.filter((_, i) => i !== index))
        setImagePreview(imagePreview.filter((_, i) => i !== index))
    }

    return (
        <div className="col-span-12 p-2 md:col-span-4 lg:col-span-3">
            <Label title="Hình ảnh sản phẩm" required />
            <div className="flex flex-wrap items-center gap-2">
                <label
                    htmlFor="image-input"
                    className={cn(
                        'border-primary flex-center mt-2 aspect-square w-full cursor-pointer flex-col gap-2 rounded-md border border-dashed bg-gray-200',
                        imagePreview.length > 0 && 'h-20 w-20',
                    )}
                >
                    <Camera size={36} className="text-primary" />
                    <p className={cn('text-sm text-gray-500', imagePreview.length > 0 && 'hidden')}>Thêm hình ảnh</p>
                </label>
                <>
                    {imagePreview.map((image, index) => (
                        <div className="relative mt-2 flex flex-wrap gap-2" key={index}>
                            <button
                                type="button"
                                className="absolute -top-2.5 -right-2.5 rounded-full border border-gray-300 bg-white p-0.5"
                                onClick={() => handleRemove(index)}
                            >
                                <X size={16} />
                            </button>

                            <img src={image} alt={image} className="h-20 w-20 rounded-md object-cover" />
                        </div>
                    ))}
                </>
            </div>
            <input type="file" className="hidden" id="image-input" multiple onChange={handleChange} accept="image/*" />
        </div>
    )
}

export default ImageUpload

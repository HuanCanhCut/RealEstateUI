interface LabelProps extends React.ComponentProps<'label'> {
    title: string
    required?: boolean
    className?: string
}

const Label: React.FC<LabelProps> = ({ title, className, required, ...props }) => {
    return (
        <label {...props} className={`flex items-center gap-2 ${className}`}>
            {title}
            {required && <span className="text-red-500">*</span>}
        </label>
    )
}

export default Label

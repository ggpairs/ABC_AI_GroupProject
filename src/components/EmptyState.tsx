interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  actionText?: string
  onAction?: () => void
}

export default function EmptyState({
  icon = 'i-mdi-inbox-outline',
  title,
  description,
  actionText,
  onAction
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div className={`${icon} text-8xl text-muted-foreground mb-4`} />
      <h3 className="text-2xl font-medium text-foreground mb-2">{title}</h3>
      {description && <p className="text-xl text-muted-foreground text-center mb-6">{description}</p>}
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="px-6 py-3 bg-primary text-primary-foreground text-xl rounded-xl flex items-center justify-center leading-none">
          {actionText}
        </button>
      )}
    </div>
  )
}

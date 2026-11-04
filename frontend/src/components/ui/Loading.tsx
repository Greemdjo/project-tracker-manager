interface LoadingProps {
  text?: string
}

export default function Loading({
  text = 'Загрузка...',
}: LoadingProps) {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />

        <p className="mt-3 text-sm text-slate-500">
          {text}
        </p>
      </div>
    </div>
  )
}
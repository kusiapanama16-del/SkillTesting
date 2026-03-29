import { useForm } from '@inertiajs/react';
import { useRef, useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';

function TagInput({
    value,
    onChange,
    placeholder,
}: {
    value: string[];
    onChange: (tags: string[]) => void;
    placeholder: string;
}) {
    const [input, setInput] = useState('');

    const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && input.trim()) {
            e.preventDefault();
            if (!value.includes(input.trim())) {
                onChange([...value, input.trim()]);
            }
            setInput('');
        }
    };

    const removeTag = (tag: string) => {
        onChange(value.filter((t) => t !== tag));
    };

    return (
        <div className="flex flex-wrap gap-2 rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
            {value.map((tag) => (
                <span
                    key={tag}
                    className="flex items-center gap-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-3 py-1 text-xs font-medium text-white shadow"
                >
                    {tag}
                    <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="opacity-70 hover:opacity-100"
                    >
                        ✕
                    </button>
                </span>
            ))}

            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={addTag}
                placeholder={placeholder}
                className="flex-1 bg-transparent text-sm outline-none"
            />
        </div>
    );
}

export default function CreateCharacter() {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        tagline: '',
        backstory: '',
        quote: '',
        guide_power_title: '',
        guide_power_description: '',
        character_type: [] as string[],
        abilities: [] as string[],
        personality: [] as string[],
        system_bonus: {
            exp_boost: '',
            gold_boost: '',
        },
        cosmetic_bonus: [] as string[],
        avatar: null as File | null,
    });

    const [preview, setPreview] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const handleFile = (file: File) => {
        if (!file.type.startsWith('image/')) return;

        if (file.size > 2 * 1024 * 1024) {
            alert('Max 2MB');
            return;
        }

        setData('avatar', file);
        setPreview(URL.createObjectURL(file));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/characters', { forceFormData: true });
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 dark:from-gray-950 dark:to-gray-900">
                <div className="mx-auto max-w-7xl">
                    {/* HEADER */}
                    <div className="mb-10 flex flex-col gap-2">
                        <h1 className="text-4xl font-bold tracking-tight">
                            Create Character
                        </h1>
                        <p className="text-gray-500">
                            Design a powerful mentor for your LMS
                        </p>
                    </div>

                    <form
                        onSubmit={submit}
                        className="grid gap-8 lg:grid-cols-[2fr_1fr]"
                    >
                        {/* LEFT */}
                        <div className="space-y-8">
                            {/* CARD */}
                            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900">
                                <h2 className="mb-6 text-lg font-semibold">
                                    Basic Information
                                </h2>

                                <div className="grid gap-5">
                                    <input
                                        placeholder="Character Name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        className="input-premium"
                                    />
                                    {errors.name && (
                                        <p className="error">{errors.name}</p>
                                    )}

                                    <input
                                        placeholder="Tagline"
                                        value={data.tagline}
                                        onChange={(e) =>
                                            setData('tagline', e.target.value)
                                        }
                                        className="input-premium"
                                    />

                                    <input
                                        placeholder="Quote"
                                        value={data.quote}
                                        onChange={(e) =>
                                            setData('quote', e.target.value)
                                        }
                                        className="input-premium"
                                    />

                                    <textarea
                                        rows={5}
                                        placeholder="Backstory"
                                        value={data.backstory}
                                        onChange={(e) =>
                                            setData('backstory', e.target.value)
                                        }
                                        className="input-premium"
                                    />
                                </div>
                            </div>

                            {/* TRAITS */}
                            <div className="rounded-2xl border bg-white p-6 shadow-lg dark:bg-gray-900">
                                <h2 className="mb-4 font-semibold">Traits</h2>

                                <div className="space-y-4">
                                    <TagInput
                                        value={data.character_type}
                                        onChange={(v) =>
                                            setData('character_type', v)
                                        }
                                        placeholder="Type"
                                    />
                                    <TagInput
                                        value={data.abilities}
                                        onChange={(v) =>
                                            setData('abilities', v)
                                        }
                                        placeholder="Abilities"
                                    />
                                    <TagInput
                                        value={data.personality}
                                        onChange={(v) =>
                                            setData('personality', v)
                                        }
                                        placeholder="Personality"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* RIGHT */}
                        <div className="space-y-6">
                            <div className="rounded-2xl border bg-white p-6 shadow-lg dark:bg-gray-900">
                                <h2 className="mb-4 font-semibold">Avatar</h2>

                                <div
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        setDragActive(true);
                                    }}
                                    onDragLeave={() => setDragActive(false)}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        setDragActive(false);
                                        if (e.dataTransfer.files[0]) {
                                            handleFile(e.dataTransfer.files[0]);
                                        }
                                    }}
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    className={`flex h-52 items-center justify-center rounded-2xl border-2 border-dashed transition ${
                                        dragActive
                                            ? 'border-indigo-500 bg-indigo-50'
                                            : 'border-gray-300'
                                    }`}
                                >
                                    {preview ? (
                                        <img
                                            src={preview}
                                            className="h-40 w-40 rounded-full object-cover shadow-lg"
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-400">
                                            Drag & drop or click
                                        </p>
                                    )}
                                </div>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                            handleFile(e.target.files[0]);
                                        }
                                    }}
                                />

                                {errors.avatar && (
                                    <p className="error">{errors.avatar}</p>
                                )}
                            </div>

                            <button
                                disabled={processing}
                                className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.02]"
                            >
                                {processing
                                    ? 'Creating...'
                                    : 'Create Character'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}

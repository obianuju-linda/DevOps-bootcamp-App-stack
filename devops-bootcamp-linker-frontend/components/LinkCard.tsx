"use client";
import React from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { FiLink } from 'react-icons/fi';
import { RiEqualFill } from 'react-icons/ri';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { socialsObject } from '@/utils/data/data';

interface LinkCardProps {
    index: number;
    platform: string;
    link: string;
    onRemove: (index: number) => void;
    onChange: (index: number, field: 'platform' | 'link', value: string) => void;
}

export default function LinkCard({ index, platform, link, onRemove, onChange }: LinkCardProps) {
    const { register, formState: { errors } } = useForm<FieldValues>({ mode: "all" });

    return (
        <div className='bg-lightGray flex flex-col gap-3 p-5 rounded-xl'>
            <div className='flex justify-between'>
                <div className='flex items-center gap-2'>
                    <RiEqualFill size={20} />
                    <p className='font-bold'>Link #{index + 1}</p>
                </div>
                <button onClick={() => onRemove(index)} className='text-primary hover:opacity-80'>Remove</button>
            </div>
            <div>
                <div className='mb-3'>
                    <label htmlFor="platform" className={`text-xs mb-2`}>Platform</label>
                    <Select onValueChange={(value) => onChange(index, 'platform', value)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={platform || "Select Platform"} />
                        </SelectTrigger>
                        <SelectContent className='relative'>
                            {Object.values(socialsObject).map((item) => {
                                const Icon = item.icon
                                return <SelectItem key={item.id} value={item.platform}>
                                    <div className="flex items-stretch gap-1">
                                        <Icon size={16} />
                                        <span className='mb-1'>{item.platform}</span>
                                    </div>
                                </SelectItem>
                            })}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label htmlFor="link" className={`text-xs mb-2 ${errors?.link ? "text-destructive" : ""}`}>Link</label>
                    <div className='relative'>
                        <input
                            {...register("link", {
                                required: "Can't be empty",
                                pattern: {
                                    value: /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(#[-a-z\d_]*)?$/i,
                                    message: "Invalid URL",
                                },
                            })}
                            type="text"
                            id="link"
                            value={link}
                            onChange={(e) => onChange(index, 'link', e.target.value)}
                            className={`w-full py-3 pl-10 pr-[105px] border ${errors?.link ? "border-destructive" : "border-neutral-300"} outline-none rounded-lg focus:shadow-purpleShadow focus:outline-[1px] focus:outline-offset-0 focus:outline-neutral-300`}
                            placeholder='e.g. https://www.github.com/johnappleseed'
                        />
                        <FiLink className="absolute top-1/2 left-4 -translate-y-1/2" size={16} />
                        {errors?.link && (
                            <p className='absolute top-1/2 right-4 -translate-y-1/2 text-destructive text-xs'>{errors?.link.message as string}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

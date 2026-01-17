"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { RefreshCw, User, Save, Palette, Type, Shirt, Glasses, Sparkles, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AvatarConstructorProps {
  currentAvatar: string;
  onApply: (avatarUrl: string) => void;
  onClose: () => void;
}

// Параметры для конструктора
const CONSTRUCTOR_PARAMS = {
  backgroundColors: [
    { value: "b6e3f4", label: "Light Blue" },
    { value: "c0aede", label: "Lavender" },
    { value: "d1d4f9", label: "Periwinkle" },
    { value: "f0e68c", label: "Khaki" },
    { value: "ffd700", label: "Gold" },
    { value: "ff69b4", label: "Hot Pink" },
    { value: "a8e6cf", label: "Mint" },
    { value: "ff69b4", label: "Pink" },
    { value: "2c2c2c", label: "Dark Gray" },
    { value: "ffffff", label: "White" },
  ],
  skinColors: [
    { value: "edb98a", label: "Light" },
    { value: "ffdbac", label: "Medium" },
    { value: "f1c27d", label: "Tan" },
    { value: "f6c7b6", label: "Warm" },
    { value: "edb98a", label: "Peach" },
    { value: "ffdbac", label: "Honey" },
  ],
  topTypes: [
    { value: "shortHairShortFlat", label: "Short Flat" },
    { value: "shortHairShortWaved", label: "Short Waved" },
    { value: "shortHairShortCurly", label: "Short Curly" },
    { value: "shortHairDreads01", label: "Dreads" },
    { value: "shortHairFrizzle", label: "Frizzle" },
    { value: "shortHairShaggyMullet", label: "Shaggy" },
  ],
  hairColors: [
    { value: "2c1b18", label: "Black" },
    { value: "4a312c", label: "Brown" },
    { value: "6b4f4f", label: "Auburn" },
    { value: "854d4e", label: "Red" },
    { value: "b5651d", label: "Blonde" },
    { value: "4a312c", label: "Dark Brown" },
  ],
  clothingTypes: [
    { value: "blazerShirt", label: "Blazer" },
    { value: "blazerSweater", label: "Blazer + Sweater" },
    { value: "collarSweater", label: "Sweater" },
    { value: "graphicShirt", label: "Graphic Tee" },
    { value: "hoodie", label: "Hoodie" },
    { value: "overall", label: "Overall" },
  ],
  clothingColors: [
    { value: "25557c", label: "Navy" },
    { value: "ff69b4", label: "Pink" },
    { value: "ffd700", label: "Gold" },
    { value: "2c2c2c", label: "Black" },
    { value: "7f4e1e", label: "Brown" },
    { value: "a8e6cf", label: "Mint" },
  ],
  accessories: [
    { value: "round", label: "Round" },
    { value: "prescription01", label: "Glasses" },
    { value: "sunglasses", label: "Sunglasses" },
    { value: "wayfarers", label: "Wayfarers" },
  ],
};

export const AvatarConstructor: React.FC<AvatarConstructorProps> = ({ currentAvatar, onApply, onClose }) => {
  const [seed, setSeed] = useState(`constructor_${Date.now()}`);
  const [params, setParams] = useState({
    backgroundColor: "b6e3f4",
    skinColor: "edb98a",
    topType: "shortHairShortFlat",
    hairColor: "2c1b18",
    clothingType: "blazerShirt",
    clothingColor: "25557c",
    accessories: "round",
    radius: 50,
  });

  const generateAvatarUrl = () => {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=${params.backgroundColor}&accessories=${params.accessories}&accessoriesProbability=100&skinColor=${params.skinColor}&topType=${params.topType}&hairColor=${params.hairColor}&facialHairType=blank&clothingType=${params.clothingType}&clothingColor=${params.clothingColor}&eyeType=happy&mouthType=smile&eyebrowType=raisedExcited&radius=${params.radius}`;
  };

  const handleRandomize = () => {
    const randomParams = {
      backgroundColor: CONSTRUCTOR_PARAMS.backgroundColors[Math.floor(Math.random() * CONSTRUCTOR_PARAMS.backgroundColors.length)].value,
      skinColor: CONSTRUCTOR_PARAMS.skinColors[Math.floor(Math.random() * CONSTRUCTOR_PARAMS.skinColors.length)].value,
      topType: CONSTRUCTOR_PARAMS.topTypes[Math.floor(Math.random() * CONSTRUCTOR_PARAMS.topTypes.length)].value,
      hairColor: CONSTRUCTOR_PARAMS.hairColors[Math.floor(Math.random() * CONSTRUCTOR_PARAMS.hairColors.length)].value,
      clothingType: CONSTRUCTOR_PARAMS.clothingTypes[Math.floor(Math.random() * CONSTRUCTOR_PARAMS.clothingTypes.length)].value,
      clothingColor: CONSTRUCTOR_PARAMS.clothingColors[Math.floor(Math.random() * CONSTRUCTOR_PARAMS.clothingColors.length)].value,
      accessories: CONSTRUCTOR_PARAMS.accessories[Math.floor(Math.random() * CONSTRUCTOR_PARAMS.accessories.length)].value,
      radius: 50,
    };
    setParams(randomParams);
    setSeed(`constructor_${Date.now()}_${Math.random()}`);
  };

  const handleApply = () => {
    onApply(generateAvatarUrl());
  };

  const handleReset = () => {
    setParams({
      backgroundColor: "b6e3f4",
      skinColor: "edb98a",
      topType: "shortHairShortFlat",
      hairColor: "2c1b18",
      clothingType: "blazerShirt",
      clothingColor: "25557c",
      accessories: "round",
      radius: 50,
    });
    setSeed(`constructor_${Date.now()}`);
  };

  // НОВАЯ ФУНКЦИЯ: Создание кастомного инпута с выбором
  const CustomSelect = ({ 
    label, 
    icon, 
    options, 
    value, 
    onChange 
  }: { 
    label: string, 
    icon: React.ReactNode, 
    options: { value: string, label: string }[], 
    value: string, 
    onChange: (val: string) => void 
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find(opt => opt.value === value);

    return (
      <div className="space-y-1 relative">
        <Label className="text-xs font-bold flex items-center gap-1">
          {icon} {label}
        </Label>
        <div className="relative">
          <Input
            readOnly
            value={selectedOption?.label || "Select..."}
            onClick={() => setIsOpen(!isOpen)}
            className="cursor-pointer h-8 text-xs pr-8 bg-white hover:bg-gray-50 transition-colors text-black"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            {isOpen ? <X className="h-3 w-3" /> : <Check className="h-3 w-3" />}
          </div>
        </div>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="absolute z-50 w-full bg-white border-2 border-gray-200 rounded-lg shadow-xl overflow-hidden mt-1"
            >
              <div className="max-h-48 overflow-y-auto">
                {options.map((option) => (
                  <motion.div
                    key={option.value}
                    whileHover={{ backgroundColor: "#f3f4f6" }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "px-3 py-2 cursor-pointer flex items-center justify-between text-xs transition-colors",
                      value === option.value ? "bg-blue-50 text-blue-600 font-bold" : "hover:bg-gray-50"
                    )}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {option.value === value && <Check className="h-3 w-3" />}
                      {option.label}
                    </div>
                    {/* Цветной индикатор для цветов */}
                    {option.value.startsWith("#") || option.value.length === 6 ? (
                      <div 
                        className="w-4 h-4 rounded-sm border border-gray-300" 
                        style={{ backgroundColor: `#${option.value}` }}
                      />
                    ) : null}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Palette className="h-5 w-5 text-purple-600" /> Конструктор аватарки
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Превью */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex justify-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Avatar className="w-32 h-32 border-4 border-purple-300 rounded-full overflow-hidden shadow-xl">
              <AvatarImage src={generateAvatarUrl()} alt="Preview" className="rounded-full" />
              <AvatarFallback>
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
          </motion.div>
        </motion.div>

        {/* Кнопки быстрых действий */}
        <div className="grid grid-cols-3 gap-2">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button onClick={handleRandomize} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
              <Sparkles className="h-4 w-4 mr-2" /> Random
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button onClick={handleReset} variant="outline" className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" /> Reset
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button onClick={handleApply} className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
              <Save className="h-4 w-4 mr-2" /> Apply
            </Button>
          </motion.div>
        </div>

        {/* Сетка параметров - НОВЫЕ ИНПУТЫ */}
        <div className="grid grid-cols-2 gap-3">
          <CustomSelect
            label="Background"
            icon={<Palette className="h-3 w-3" />}
            options={CONSTRUCTOR_PARAMS.backgroundColors}
            value={params.backgroundColor}
            onChange={(val) => setParams({ ...params, backgroundColor: val })}
          />

          <CustomSelect
            label="Skin"
            icon={<User className="h-3 w-3" />}
            options={CONSTRUCTOR_PARAMS.skinColors}
            value={params.skinColor}
            onChange={(val) => setParams({ ...params, skinColor: val })}
          />

          <CustomSelect
            label="Hair Style"
            icon={<Type className="h-3 w-3" />}
            options={CONSTRUCTOR_PARAMS.topTypes}
            value={params.topType}
            onChange={(val) => setParams({ ...params, topType: val })}
          />

          <CustomSelect
            label="Hair Color"
            icon={<Palette className="h-3 w-3" />}
            options={CONSTRUCTOR_PARAMS.hairColors}
            value={params.hairColor}
            onChange={(val) => setParams({ ...params, hairColor: val })}
          />

          <CustomSelect
            label="Clothes"
            icon={<Shirt className="h-3 w-3" />}
            options={CONSTRUCTOR_PARAMS.clothingTypes}
            value={params.clothingType}
            onChange={(val) => setParams({ ...params, clothingType: val })}
          />

          <CustomSelect
            label="Clothes Color"
            icon={<Palette className="h-3 w-3" />}
            options={CONSTRUCTOR_PARAMS.clothingColors}
            value={params.clothingColor}
            onChange={(val) => setParams({ ...params, clothingColor: val })}
          />

          <CustomSelect
            label="Glasses"
            icon={<Glasses className="h-3 w-3" />}
            options={CONSTRUCTOR_PARAMS.accessories}
            value={params.accessories}
            onChange={(val) => setParams({ ...params, accessories: val })}
          />

          {/* Radius Slider */}
          <div className="space-y-1 col-span-2">
            <Label className="text-xs font-bold flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Roundness: {params.radius}%
            </Label>
            <Slider
              value={[params.radius]}
              onValueChange={([value]) => setParams({ ...params, radius: value })}
              min={0}
              max={50}
              step={1}
              className="w-full"
            />
          </div>
        </div>

        {/* Close button */}
        <Button onClick={onClose} variant="outline" className="w-full mt-2">
          Close Constructor
        </Button>
      </CardContent>
    </Card>
  );
};
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Settings, RefreshCw, User, Save, Palette, Type, Shirt, Glasses, Sparkles } from "lucide-react";
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

        {/* Сетка параметров */}
        <div className="grid grid-cols-2 gap-3">
          {/* Background Color */}
          <div className="space-y-1">
            <Label className="text-xs font-bold flex items-center gap-1">
              <Palette className="h-3 w-3" /> Background
            </Label>
            <Select
              value={params.backgroundColor}
              onValueChange={(value) => setParams({ ...params, backgroundColor: value })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Background" />
              </SelectTrigger>
              <SelectContent>
                {CONSTRUCTOR_PARAMS.backgroundColors.map((color) => (
                  <SelectItem key={color.value} value={color.value}>
                    <div className="flex items-center gap-2">
                      <div className={cn("w-4 h-4 rounded-sm", `bg-[#${color.value}]`)} style={{ backgroundColor: `#${color.value}` }}></div>
                      {color.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Skin Color */}
          <div className="space-y-1">
            <Label className="text-xs font-bold flex items-center gap-1">
              <User className="h-3 w-3" /> Skin
            </Label>
            <Select
              value={params.skinColor}
              onValueChange={(value) => setParams({ ...params, skinColor: value })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Skin" />
              </SelectTrigger>
              <SelectContent>
                {CONSTRUCTOR_PARAMS.skinColors.map((color) => (
                  <SelectItem key={color.value} value={color.value}>
                    <div className="flex items-center gap-2">
                      <div className={cn("w-4 h-4 rounded-sm", `bg-[#${color.value}]`)} style={{ backgroundColor: `#${color.value}` }}></div>
                      {color.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Hair Type */}
          <div className="space-y-1">
            <Label className="text-xs font-bold flex items-center gap-1">
              <Type className="h-3 w-3" /> Hair Style
            </Label>
            <Select
              value={params.topType}
              onValueChange={(value) => setParams({ ...params, topType: value })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Hair" />
              </SelectTrigger>
              <SelectContent>
                {CONSTRUCTOR_PARAMS.topTypes.map((style) => (
                  <SelectItem key={style.value} value={style.value}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Hair Color */}
          <div className="space-y-1">
            <Label className="text-xs font-bold flex items-center gap-1">
              <Palette className="h-3 w-3" /> Hair Color
            </Label>
            <Select
              value={params.hairColor}
              onValueChange={(value) => setParams({ ...params, hairColor: value })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Hair Color" />
              </SelectTrigger>
              <SelectContent>
                {CONSTRUCTOR_PARAMS.hairColors.map((color) => (
                  <SelectItem key={color.value} value={color.value}>
                    <div className="flex items-center gap-2">
                      <div className={cn("w-4 h-4 rounded-sm", `bg-[#${color.value}]`)} style={{ backgroundColor: `#${color.value}` }}></div>
                      {color.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clothing Type */}
          <div className="space-y-1">
            <Label className="text-xs font-bold flex items-center gap-1">
              <Shirt className="h-3 w-3" /> Clothes
            </Label>
            <Select
              value={params.clothingType}
              onValueChange={(value) => setParams({ ...params, clothingType: value })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Clothes" />
              </SelectTrigger>
              <SelectContent>
                {CONSTRUCTOR_PARAMS.clothingTypes.map((style) => (
                  <SelectItem key={style.value} value={style.value}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clothing Color */}
          <div className="space-y-1">
            <Label className="text-xs font-bold flex items-center gap-1">
              <Palette className="h-3 w-3" /> Clothes Color
            </Label>
            <Select
              value={params.clothingColor}
              onValueChange={(value) => setParams({ ...params, clothingColor: value })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Clothes Color" />
              </SelectTrigger>
              <SelectContent>
                {CONSTRUCTOR_PARAMS.clothingColors.map((color) => (
                  <SelectItem key={color.value} value={color.value}>
                    <div className="flex items-center gap-2">
                      <div className={cn("w-4 h-4 rounded-sm", `bg-[#${color.value}]`)} style={{ backgroundColor: `#${color.value}` }}></div>
                      {color.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Accessories */}
          <div className="space-y-1">
            <Label className="text-xs font-bold flex items-center gap-1">
              <Glasses className="h-3 w-3" /> Glasses
            </Label>
            <Select
              value={params.accessories}
              onValueChange={(value) => setParams({ ...params, accessories: value })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Glasses" />
              </SelectTrigger>
              <SelectContent>
                {CONSTRUCTOR_PARAMS.accessories.map((style) => (
                  <SelectItem key={style.value} value={style.value}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Plus, Minus, Star, CheckCircle } from 'lucide-react';

interface EffectsLibraryProps {
  effects: any[];
  selectedEffects: any[];
  onSelectionChange: (effects: any[]) => void;
}

export function EffectsLibrary({ effects, selectedEffects, onSelectionChange }: EffectsLibraryProps) {
  const groupedEffects = effects.reduce((acc, effect) => {
    if (!acc[effect.category]) {
      acc[effect.category] = [];
    }
    acc[effect.category].push(effect);
    return acc;
  }, {} as Record<string, any[]>);

  const toggleEffect = (effect: any) => {
    const isSelected = selectedEffects.some(e => e.id === effect.id);
    if (isSelected) {
      onSelectionChange(selectedEffects.filter(e => e.id !== effect.id));
    } else {
      onSelectionChange([...selectedEffects, effect]);
    }
  };

  const isEffectSelected = (effect: any) => {
    return selectedEffects.some(e => e.id === effect.id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Professional Video Effects</h3>
        <p className="text-muted-foreground">
          Add cinematic transitions, color grading, and animations to your videos
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Effects</TabsTrigger>
          <TabsTrigger value="transitions">Transitions</TabsTrigger>
          <TabsTrigger value="color_grading">Color</TabsTrigger>
          <TabsTrigger value="overlays">Overlays</TabsTrigger>
          <TabsTrigger value="animations">Animations</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {Object.entries(groupedEffects).map(([category, categoryEffects]: [string, any[]]) => (
            <div key={category} className="space-y-3">
              <h4 className="font-medium capitalize text-primary">
                {category.replace('_', ' ')} Effects
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryEffects.map((effect: any) => (
                  <EffectCard
                    key={effect.id}
                    effect={effect}
                    isSelected={isEffectSelected(effect)}
                    onToggle={() => toggleEffect(effect)}
                    onPreview={() => {}}
                  />
                ))}
              </div>
            </div>
          ))}
        </TabsContent>

        {Object.entries(groupedEffects).map(([category, categoryEffects]: [string, any[]]) => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryEffects.map((effect: any) => (
                <EffectCard
                  key={effect.id}
                  effect={effect}
                  isSelected={isEffectSelected(effect)}
                  onToggle={() => toggleEffect(effect)}
                  onPreview={() => {}}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {selectedEffects.length > 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Selected Effects ({selectedEffects.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedEffects.map((effect) => (
                <Badge
                  key={effect.id}
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => toggleEffect(effect)}
                >
                  {effect.name}
                  <Minus className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function EffectCard({ effect, isSelected, onToggle, onPreview }: any) {
  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
      }`}
      onClick={onToggle}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            {effect.name}
            {isSelected && <CheckCircle className="h-4 w-4 text-primary" />}
          </CardTitle>
          {effect.is_premium && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              <Star className="h-3 w-3 mr-1" />
              Pro
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="h-20 bg-gradient-to-br from-muted/50 to-muted rounded flex items-center justify-center">
          <Eye className="h-6 w-6 text-muted-foreground" />
        </div>
        
        <div className="flex items-center justify-between">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onPreview();
            }}
          >
            <Eye className="h-3 w-3 mr-1" />
            Preview
          </Button>
          <Button
            size="sm"
            variant={isSelected ? "default" : "outline"}
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
          >
            {isSelected ? (
              <>
                <Minus className="h-3 w-3 mr-1" />
                Remove
              </>
            ) : (
              <>
                <Plus className="h-3 w-3 mr-1" />
                Add
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

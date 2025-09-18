"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface PricingInputProps {
  price: number
  priceText: string
  currency: string
  pricingType: "fixed" | "custom"
  onPriceChange: (price: number) => void
  onPriceTextChange: (text: string) => void
  onCurrencyChange: (currency: string) => void
  onPricingTypeChange: (type: "fixed" | "custom") => void
  required?: boolean
}

export function PricingInput({
  price,
  priceText,
  currency,
  pricingType,
  onPriceChange,
  onPriceTextChange,
  onCurrencyChange,
  onPricingTypeChange,
  required = false,
}: PricingInputProps) {
  return (
    <div className="space-y-4">
      <Label>Pricing Type {required && "*"}</Label>
      <RadioGroup
        value={pricingType}
        onValueChange={(value: "fixed" | "custom") => onPricingTypeChange(value)}
        className="flex space-x-6"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="fixed" id="fixed" />
          <Label htmlFor="fixed">Fixed Price</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="custom" id="custom" />
          <Label htmlFor="custom">Custom Pricing</Label>
        </div>
      </RadioGroup>

      {pricingType === "fixed" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Price {required && "*"}</Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => onPriceChange(Number(e.target.value))}
              required={required}
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </div>
          <div>
            <Label htmlFor="currency">Currency {required && "*"}</Label>
            <Select value={currency} onValueChange={onCurrencyChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
                <SelectItem value="JPY">JPY (¥)</SelectItem>
                <SelectItem value="CAD">CAD (C$)</SelectItem>
                <SelectItem value="AUD">AUD (A$)</SelectItem>
                <SelectItem value="CHF">CHF (Fr)</SelectItem>
                <SelectItem value="CNY">CNY (¥)</SelectItem>
                <SelectItem value="INR">INR (₹)</SelectItem>
                <SelectItem value="KRW">KRW (₩)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      ) : (
        <div>
          <Label htmlFor="price_text">Custom Pricing Text {required && "*"}</Label>
          <Textarea
            id="price_text"
            value={priceText}
            onChange={(e) => onPriceTextChange(e.target.value)}
            required={required && pricingType === "custom"}
            placeholder="e.g., Starting from $500 per person, Contact us for pricing, Varies by season"
            rows={3}
          />
        </div>
      )}
    </div>
  )
}

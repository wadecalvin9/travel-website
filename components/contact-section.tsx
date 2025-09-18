import { Mail, MapPin, MessageCircle, Phone, Clock } from "lucide-react"
import { useSettings } from "@/components/settings-provider"

export function ContactSection() {
  const { settings, loading } = useSettings()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Phone className="h-6 w-6 text-primary" />
            <div>
              <p className="font-semibold">Phone</p>
              <p className="text-gray-600">{settings.contact_phone_primary || "+254 700 123 456"}</p>
              {settings.contact_phone_secondary && <p className="text-gray-600">{settings.contact_phone_secondary}</p>}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Mail className="h-6 w-6 text-primary" />
            <div>
              <p className="font-semibold">Email</p>
              <p className="text-gray-600">{settings.contact_email_primary || "info@travelconnectexpeditions.com"}</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <MapPin className="h-6 w-6 text-primary mt-1" />
            <div>
              <p className="font-semibold">Address</p>
              <div className="text-gray-600 whitespace-pre-line">
                {settings.contact_address || "Safari Center, 2nd Floor\nNairobi, Kenya\nP.O. Box 12345-00100"}
              </div>
            </div>
          </div>

          {settings.contact_hours && (
            <div className="flex items-start space-x-4">
              <Clock className="h-6 w-6 text-primary mt-1" />
              <div>
                <p className="font-semibold">Business Hours</p>
                <div className="text-gray-600 whitespace-pre-line">{settings.contact_hours}</div>
              </div>
            </div>
          )}

          {settings.whatsapp_number && (
            <div className="flex items-center space-x-4">
              <MessageCircle className="h-6 w-6 text-primary" />
              <div>
                <p className="font-semibold">WhatsApp</p>
                <a
                  href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, "")}`}
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {settings.whatsapp_number}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        {settings.map_embed_url && (
          <iframe
            src={settings.map_embed_url}
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-lg"
          />
        )}
      </div>
    </div>
  )
}

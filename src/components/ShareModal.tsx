import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareOption {
  id: string;
  name: string;
  icon: string;
  color: string;
  action: (url: string, title: string, text: string) => void;
}

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
  text: string;
}

export function ShareModal({ isOpen, onClose, url, title, text }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [showFacebookModal, setShowFacebookModal] = useState(false);
  const [facebookMessage, setFacebookMessage] = useState('');
  const { toast } = useToast();

  const shareOptions: ShareOption[] = [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: '📘',
      color: 'bg-[#1877F2] hover:bg-[#166FE5]',
      action: (url, title, text) => {
        // Abrir diretamente o diálogo de criar post do Facebook com o link do pet
        const shareText = `🐾 ${title}\n\n${text}`;
        const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(shareText)}`;

        window.open(facebookShareUrl, '_blank', 'noopener');
      }
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: '💬',
      color: 'bg-[#25D366] hover:bg-[#1faa52]',
      action: (url, title, text) => {
        // WhatsApp mais pessoal e direto
        const whatsText = `🐾 *${title}*

${text}

Olha que fofinho! Será que você conhece alguém que gostaria de adotar? 🥺

Veja mais detalhes: ${url}

#AdocaoResponsavel #AmorIncondicional`;
        
        // Usar whatsapp:// para melhor compatibilidade mobile
        const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(whatsText)}`;
        const webWhatsappUrl = `https://web.whatsapp.com/send?text=${encodeURIComponent(whatsText)}`;
        
        // Tentar abrir o app nativo primeiro, depois fallback para web
        const link = document.createElement('a');
        link.href = whatsappUrl;
        link.target = '_blank';
        link.click();
        
        // Fallback para web WhatsApp se o app não abrir em 2 segundos
        setTimeout(() => {
          window.open(webWhatsappUrl, '_blank');
        }, 2000);
      }
    }
  ];

  const handleCopyFacebookMessage = async () => {
    try {
      await navigator.clipboard.writeText(facebookMessage);
      toast({
        title: "✅ Mensagem copiada!",
        description: "Agora você pode colar no Facebook",
        duration: 3000
      });
    } catch (error) {
      toast({
        title: "Erro ao copiar",
        description: "Tente selecionar e copiar manualmente",
        variant: "destructive"
      });
    }
  };

  const handleOpenFacebook = () => {
    // Abrir o Facebook no feed principal
    window.open('https://www.facebook.com/', '_blank');
    setShowFacebookModal(false);
  };

  const handleCopyLink = async () => {
    console.log('🔍 Copy button clicked!');
    console.log('📋 URL to copy:', url);
    console.log('🌐 Clipboard API available:', !!navigator.clipboard);
    console.log('🔒 Secure context:', window.isSecureContext);
    
    try {
      // Método mais simples e direto
      await navigator.clipboard.writeText(url);
      
      console.log('✅ Copy successful via Clipboard API');
      setCopied(true);
      toast({
        title: "✅ Link copiado!",
        description: "O link foi copiado para a área de transferência"
      });
      
      setTimeout(() => setCopied(false), 2000);
      
    } catch (error) {
      console.log('❌ Clipboard API failed:', error);
      
      // Fallback simples se clipboard API falhar
      try {
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        textArea.setSelectionRange(0, 99999);
        
        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        console.log('📄 execCommand result:', success);
        
        if (success) {
          setCopied(true);
          toast({
            title: "✅ Link copiado!",
            description: "O link foi copiado para a área de transferência"
          });
          
          setTimeout(() => setCopied(false), 2000);
        } else {
          throw new Error('execCommand returned false');
        }
        
      } catch (fallbackError) {
        console.log('❌ Fallback also failed:', fallbackError);
        
        // Se tudo falhar, mostrar modal com o link
        toast({
          title: "Copie o link manualmente",
          description: url,
          duration: 10000
        });
        
        // Selecionar o input para facilitar cópia manual
        const input = document.querySelector('input[readonly]') as HTMLInputElement;
        if (input) {
          input.focus();
          input.select();
        }
      }
    }
  };

  const handleShare = (option: ShareOption) => {
    option.action(url, title, text);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg border-0 bg-transparent shadow-none p-0 overflow-hidden">
          <div className="bg-orange-gradient p-1 rounded-2xl shadow-2xl">
            <div className="bg-white rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 pb-4">
                <DialogTitle className="text-xl font-bold text-gray-900">Share</DialogTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Share Options */}
              <div className="px-6 py-4">
                <div className="grid grid-cols-4 gap-6">
                  {shareOptions.map((option) => (
                    <div key={option.id} className="flex flex-col items-center space-y-3">
                      <Button
                        onClick={() => handleShare(option)}
                        className={`h-16 w-16 rounded-2xl ${option.color} shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 text-white text-2xl border-0`}
                      >
                        {option.icon}
                      </Button>
                      <span className="text-xs font-medium text-gray-600 text-center">
                        {option.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* URL Section */}
              <div className="px-6 pb-6 pt-2">
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex-1 min-w-0">
                    <Input
                      value={url}
                      readOnly
                      className="bg-transparent text-gray-700 text-sm border-0 focus-visible:ring-0 p-0 font-mono truncate"
                    />
                  </div>
                  <Button
                    onClick={handleCopyLink}
                    size="sm"
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      copied 
                        ? 'bg-green-500 hover:bg-green-600 text-white' 
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal do Facebook */}
      <Dialog open={showFacebookModal} onOpenChange={setShowFacebookModal}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              📘 Compartilhar no Facebook
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 mb-3 font-medium">
                ✨ Sua mensagem está pronta! Copie o texto abaixo e cole no Facebook:
              </p>
              
              <div className="bg-white border border-blue-200 rounded-lg p-4 max-h-48 overflow-y-auto">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">
                  {facebookMessage}
                </pre>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleCopyFacebookMessage}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copiar Mensagem
              </Button>
              
              <Button 
                onClick={handleOpenFacebook}
                className="flex-1 bg-[#1877F2] hover:bg-[#166FE5] text-white"
              >
                📘 Abrir Facebook
              </Button>
            </div>

            <div className="text-xs text-gray-600 bg-gray-50 rounded-lg p-3">
              <p className="font-medium mb-1">💡 Como usar:</p>
              <p>1. Clique em "Copiar Mensagem"</p>
              <p>2. Clique em "Abrir Facebook"</p>
              <p>3. Cole a mensagem (Cmd+V) em um novo post</p>
              <p>4. Publique para ajudar na adoção! 🐾</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
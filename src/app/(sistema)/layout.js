import { exigirUsuario } from "@/lib/auth";
import Navegacao from "@/components/Navegacao";

export const dynamic = "force-dynamic";

// Todas as telas deste grupo exigem login (RNF003).
export default function SistemaLayout({ children }) {
  const usuario = exigirUsuario();
  return (
    <>
      <Navegacao usuario={usuario} />
      {children}
    </>
  );
}

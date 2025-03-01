# 🦴 React Skeleton Loader Generator

Un generador automático de componentes skeleton loader para React utilizando Tailwind CSS y OpenAI.

## 📝 Descripción

Este proyecto proporciona una API que convierte automáticamente estructuras de componentes React en sus correspondientes skeleton loaders utilizando Tailwind CSS. Utiliza la API de OpenAI para generar loaders que mantienen la estructura y el diseño del componente original.

## ✨ Características

- Generación automática de skeleton loaders
- Uso de Tailwind CSS para los estilos
- Animación de pulso incluida por defecto
- Dimensiones predeterminadas inteligentes para elementos comunes
- Mantenimiento de clases responsive
- Integración con OpenAI

## 🚀 Configuración

1. Clona el repositorio:
```bash
git clone https://github.com/elrincondeldev/skeleton-loader-generator
cd skeleton-loader-generator
```

2. Instala las dependencias:
```bash
npm install
# o
yarn install
```

3. Configura las variables de entorno:
Crea un archivo `.env` en la raíz del proyecto:
```env
OPENAI_API_KEY=tu-api-key-de-openai
```

4. Inicia el servidor de desarrollo:
```bash
npm run dev
# o
yarn dev
```

## 🔧 Uso

Para generar un skeleton loader, realiza una petición POST a `/api/generate` con la estructura del componente:

```javascript
const response = await fetch('/api/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    component: `
      <div className="p-4">
        <h1>Título Principal</h1>
        <p>Contenido del párrafo</p>
        <button>Click me</button>
      </div>
    `
  })
});

const { skeletonCode } = await response.json();
```

## 📋 Reglas de Generación

El generador sigue estas reglas para crear skeleton loaders consistentes:

1. Utiliza exclusivamente clases de Tailwind CSS
2. Usa `bg-gray-300` para los fondos de placeholder
3. Incluye `animate-pulse` para la animación de carga
4. Mantiene el espaciado y dimensiones relativas al componente original
5. Dimensiones predeterminadas para elementos sin ancho especificado:
   - div: `w-full`
   - párrafos: `w-full h-4`
   - h1: `w-3/4 h-8`
   - h2: `w-2/3 h-6`
   - h3: `w-1/2 h-5`
   - img: `w-full h-48`
   - button: `w-24 h-10`
   - input: `w-full h-10`

## 🛠️ Tecnologías

- Next.js
- React
- Tailwind CSS
- OpenAI API
- TypeScript

## 📄 Licencia

MIT

## 👥 Contribución

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios que te gustaría realizar.

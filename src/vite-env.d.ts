// 客户端类型(类型声明文件,类似于在tsconfig.ts中的 compilerOptions.types )
// 没有这个就相当于没有类型声明,比如没有 svg,less,png 等等的类型声明
// vite/client 帮助我们处理了大部分的类型声明
/// <reference types="vite/client" />

// 对自定义的环境变量新增类型
interface ImportMetaEnv {
  readonly VITE_ABC: string;
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

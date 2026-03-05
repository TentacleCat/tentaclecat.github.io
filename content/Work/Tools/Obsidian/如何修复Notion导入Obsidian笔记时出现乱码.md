---
tags:
  - 工具
  - Obsidian
  - Notion
  - 编码
  - Python
  - 乱码
  - 数据迁移
aliases:
  - Notion乱码修复
slug: Notion2Obsidian_UTF8
publish: true
---

执行以下脚本

> [!tip] 核心原理
> Notion 这种乱码通常是 UTF-8 字节被当成了 CP437 或 Latin-1，需要先强制转换回原始字节，再重新用 UTF-8 解码。

```
import os

def fix_filename(bad_name):
    # 核心映射：Notion 这种乱码通常是 UTF-8 字节被当成了 CP437 或 Latin-1
    # 我们需要先强制转换回原始字节，再重新用 UTF-8 解码
    try:
        # 针对你 ls 结果中出现的 Φ, σ, µ 等字符，这通常是 cp437 编码
        raw_bytes = bad_name.encode('cp437')
        return raw_bytes.decode('utf-8')
    except:
        try:
            # 如果 cp437 不行，尝试 latin-1
            raw_bytes = bad_name.encode('iso-8859-1')
            return raw_bytes.decode('utf-8')
        except:
            return bad_name

def rename_files(root_path):
    # topdown=False 确保先处理子文件，再处理文件夹
    for root, dirs, files in os.walk(root_path, topdown=False):
        for name in files + dirs:
            new_name = fix_filename(name)
            
            if new_name != name:
                old_path = os.path.join(root, name)
                new_path = os.path.join(root, new_name)
                
                try:
                    # 检查目标是否已存在，避免覆盖
                    if not os.path.exists(new_path):
                        os.rename(old_path, new_path)
                        print(f"成功: {name} -> {new_name}")
                    else:
                        print(f"跳过 (已存在): {new_name}")
                except Exception as e:
                    print(f"失败 {name}: {e}")

if __name__ == "__main__":
    # 你当前的目录
    target_path = os.getcwd() 
    print(f"正在处理目录: {target_path}")
    rename_files(target_path)
```

> [!warning] 使用前建议
> 运行前建议先备份文件，或者在测试目录中先尝试。

---

*相关标签：#Python #编码 #乱码 #数据迁移*

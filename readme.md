## termux_launcher

>  在[termux](https://termux.com/help.html)中运行的服务启停工具

## 使用方法

### 启用 termux-chroot

1. 安装 termux-exec .

    `$ pkg install termux-exec`
    
1. 在/home目录添加`.bash_profile文件`，内容如下

    `if ! pgrep -f "proot" >/dev/null ; then termux-chroot ;fi`

1. 关闭 termux APP 重新启动

### 安装 nodejs

    $ pkg install node

### 下载

    $ git clone https://github.com/mescp/termux_launcher.git
    
### 安装依赖

    $ cd termux_launcher
    $ npm install
    
### 初始化

1. 设置 `config.json`

    `$ cp  config_example.json config.json`

说明：

    {
      "appTitle": [
        [
          "名称",         
          "状态"
        ]
      ],
      "appList": [
        {
          "name": "sshd",       -- 服务名称，不能重复
          "command": "sshd",    -- 执行命令
          "args": "",           -- 执行命令的参数
          "grep": "sshd"        -- 查找和停止服务的grep参数
        },
        {
          "name": "aria2c",     
          "command": "bash",
          "args": "./bin/aria2c.sh",    -- 通过 pkg install aria2c 安装
          "grep": "aria2c"
        },
        {
           ......
        }
      ]
    }
    
1. 全局安装

    `$ npm link`
    
## 启动

    $ launcher

![demo](./docs/demo.gif)


## License

The MIT License

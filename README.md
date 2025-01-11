# 🎯 XSS Hunter 2.0

A Maintained updated version of original [xsshunter-express](https://github.com/mandatoryprogrammer/xsshunter-express) to keep it operational and addon new features.

## 🌟 Features

- 📸 Full page screenshots of XSS payload fires
- 🔍 DOM snapshot at time of payload fire  
- 🌐 Victim's cookies (non-httponly)
- 📱 Victim's user agent
- 📍 Victim's IP address
- ↩️ Origin of execution
- 🔗 URL of execution
- 🎨 Clean UI
- 🔔 Discord notifications 🆕
<img src="https://github.com/user-attachments/assets/f4c3f2db-bcea-4316-9acf-490fdf0901b6" alt="discord" width="300">

## 🚀 Deployment Guide

### Prerequisites

- A VPS running Ubuntu/Debian
- Domain name pointing to your VPS
- Docker and Docker Compose installed
- Nginx installed

### 1️⃣ Initial Setup

```bash
# Install required packages
apt update
apt install -y docker.io docker-compose nginx certbot python3-certbot-nginx

# Clone the repository
git clone https://github.com/BitThr3at/XSSHunter2.0  
cd XSSHunter2.0
```

### 2️⃣ Configuration

1. Edit `docker-compose.yml` and update these values:
```yaml
environment:
  - HOSTNAME=yourdomain.com        # Your domain name
  - DISCORD_WEBHOOK_URL=your_url   # Your Discord webhook URL
```

### 3️⃣ SSL and Nginx Setup

1. First, obtain SSL certificate using certbot:
```bash
sudo apt install python3-certbot-nginx
certbot --nginx -d yourdomain.com
```
![image](https://github.com/user-attachments/assets/1cc5b76a-0ac5-4767-bcfc-33afd7cd1c97)

2. After certbot finishes setting up nginx, add proxy configuration to the HTTPS server block in `/etc/nginx/sites-available/yourdomain.com`:
```nginx
# Find the server block with SSL configuration (port 443)
server {
    # ... existing SSL configuration from certbot ...

    # Add proxy configuration
    location / {
        proxy_pass http://localhost:8082;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
![image](https://github.com/user-attachments/assets/0b6b0bcd-9de8-4b04-aa55-2a4d9b5accc8)

3. Test and restart Nginx:
```bash
nginx -t && systemctl restart nginx
```

### 4️⃣ Start the Application

```bash
# Start the services
docker-compose up -d

# Check logs
docker-compose logs -f
```
![image](https://github.com/user-attachments/assets/d6f0020d-c6cd-4b17-a9b1-9dafc845f236)


### 5️⃣ Post-Installation

1. Access the admin panel at `https://yourdomain.com/admin/`
2. The initial password will be displayed in the docker logs
   
## 🛡️ Additonal Security
You can configure Cloudflare to proxy your XSSHunter server and protect your VPS IP address. However, there are two key adjustments you need to make in Cloudflare to ensure everything works correctly:
1. Set ssl configuration as `full`
![image](https://github.com/user-attachments/assets/03260520-6c68-4e2c-9355-55b2ef464f4f)
2. create a modify response header rule in cloudflare like below
![image](https://github.com/user-attachments/assets/e52c7a6a-3fe4-4b6d-82bc-5f9137dcbbbe)
![image](https://github.com/user-attachments/assets/8835e4c0-652f-4611-924c-c9c1ad110a3f)



## 🔧 Troubleshooting

1. **Nginx 502 Bad Gateway**
   - Check if Docker containers are running
   - Verify port configuration in docker-compose.yml
   - Check nginx logs: `tail -f /var/log/nginx/error.log`

2. **SSL Certificate Issues**
   - Ensure certbot generated certificates correctly
   - Check certificate renewal: `certbot renew --dry-run`

3. **Discord Notifications Not Working**
   - Verify webhook URL is correct in docker-compose.yml
   - Check if notifications are enabled in settings
   - Look for errors in application logs

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Credits

- Original XSS Hunter by [@mandatoryprogrammer](https://github.com/mandatoryprogrammer)
- Express project maintained by the community

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---
⚠️ **Disclaimer**: This tool is for educational and security research purposes only. Always obtain proper authorization before testing for XSS vulnerabilities.

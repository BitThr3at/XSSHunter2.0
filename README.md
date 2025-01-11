# 🎯 XSS Hunter Express

A lightweight version of XSS Hunter that you can deploy on your own VPS! Captures XSS payloads and all kinds of useful data when they fire.

## 🌟 Features

- 📸 Full page screenshots of XSS payload fires
- 🔍 DOM snapshot at time of payload fire  
- 🌐 Victim's cookies
- 📱 Victim's user agent
- 📍 Victim's IP address
- ↩️ Origin of execution
- 🔗 URL of execution
- 🎨 Clean and modern UI
- 🔔 Discord notifications
- 🔒 Secure by default

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
git clone https://github.com/mandatoryprogrammer/xsshunter-express
cd xsshunter-express
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
certbot --nginx -d yourdomain.com
```

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

### 5️⃣ Post-Installation

1. Access the admin panel at `https://yourdomain.com/admin/`
2. The initial password will be displayed in the docker logs
3. Configure your Discord webhook URL in the settings
4. Generate your API keys and start collecting XSS payloads!

## 🛡️ Security Recommendations

- 🔒 Change the default password immediately
- 🔐 Use strong passwords for database and admin access
- 🚫 Restrict access to admin panel by IP if possible
- 🔄 Regularly update the application and dependencies
- 📝 Monitor logs for suspicious activities
- 🔥 Use firewall rules to restrict access

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
- Express port maintained by the community

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---
⚠️ **Disclaimer**: This tool is for educational and security research purposes only. Always obtain proper authorization before testing for XSS vulnerabilities.
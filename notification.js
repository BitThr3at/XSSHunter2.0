const database = require('./database.js');
const constants = require('./constants.js');
const fetch = require('node-fetch');

async function send_discord_notification(xss_payload_fire_data) {
	// Check if Discord notifications are enabled
	const notifications_setting = await database.Settings.findOne({
		where: {
			key: 'DISCORD_NOTIFICATIONS_ENABLED'
		}
	});

	// Convert string 'true'/'false' to boolean
	const isEnabled = notifications_setting ? notifications_setting.value === 'true' : true;

	if (!isEnabled) {
		console.log('Discord notifications are disabled, skipping notification');
		return;
	}

	// Check if webhook URL is configured
	if (!process.env.DISCORD_WEBHOOK_URL) {
		console.log('No Discord webhook URL configured, skipping notification');
		return;
	}

	try {
		const notification_data = {
			embeds: [{
				title: 'XSS Payload Fired!',
				description: `A new XSS payload has fired on ${xss_payload_fire_data.url}`,
				fields: [
					{
						name: 'URL',
						value: xss_payload_fire_data.url
					},
					{
						name: 'Referer',
						value: xss_payload_fire_data.referer || 'None'
					},
					{
						name: 'IP Address',
						value: xss_payload_fire_data.ip_address
					},
					{
						name: 'User Agent',
						value: xss_payload_fire_data.user_agent
					},
					{
						name: 'Cookies',
						value: xss_payload_fire_data.cookies || 'None'
					}
				],
				color: 0xff0000,
				timestamp: new Date().toISOString()
			}]
		};

		const response = await fetch(process.env.DISCORD_WEBHOOK_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(notification_data),
		});

		if (!response.ok) {
			throw new Error(`Discord API responded with status: ${response.status}`);
		}

		console.log('Discord notification sent successfully');
	} catch (error) {
		console.error('Failed to send Discord notification:', error);
	}
}

module.exports = {
	send_discord_notification
};
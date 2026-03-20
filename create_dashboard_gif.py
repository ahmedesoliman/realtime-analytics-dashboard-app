#!/usr/bin/env python3
"""
Create an animated GIF of the dashboard with live updates
"""
import asyncio
import imageio
from pathlib import Path
from playwright.async_api import async_playwright

async def create_dashboard_gif():
    """Capture dashboard frames and create animated GIF"""
    frames = []
    
    async with async_playwright() as p:
        # Launch browser
        browser = await p.chromium.launch()
        page = await browser.new_page()
        
        # Navigate to dashboard
        print("Loading dashboard...")
        await page.goto('http://localhost:3001', wait_until='networkidle')
        
        # Wait for data to load
        await asyncio.sleep(2)
        
        # Capture frames over 30 seconds (1 frame every 2 seconds for realistic changes)
        print("Recording dashboard animation...")
        for i in range(15):
            print(f"  Capturing frame {i+1}/15...")
            
            # Take screenshot
            screenshot = await page.screenshot(type='png')
            frames.append(screenshot)
            
            # Wait 2 seconds between frames for realistic metric changes
            await asyncio.sleep(2)
        
        await browser.close()
    
    # Create GIF from frames
    print("Creating animated GIF...")
    images = [imageio.imread(frame) for frame in frames]
    output_path = 'dashboard-animation.gif'
    imageio.mimsave(output_path, images, duration=2.0, loop=0)
    
    print(f"✅ GIF created: {output_path}")
    return output_path

if __name__ == '__main__':
    path = asyncio.run(create_dashboard_gif())
    print(f"Saved to: {Path(path).absolute()}")

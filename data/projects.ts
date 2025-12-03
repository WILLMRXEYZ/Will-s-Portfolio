
import { Project } from '../types';

/**
 * ==========================================================================================
 *  🚀 HOW TO ADD PROJECTS (GOOGLE DRIVE METHOD)
 * ==========================================================================================
 * 
 *  1. Upload image to Google Drive.
 *  2. Share -> "Anyone with link".
 *  3. Log into Admin on this website.
 *  4. Use the Generator Tool to create the code block.
 *  5. Paste the code block below into the STATIC_PROJECTS array.
 * 
 * ==========================================================================================
 */

export const STATIC_PROJECTS: Project[] = [
    // --- 2D/3D ILLUSTRATION SAMPLES ---
    {
    id: 1764782148532,
    title: "Project 1764782148532",
    type: 'illustration',
    imageUrl: "https://drive.google.com/uc?export=view&id=1b7VxajPIQ49RBI7UaqwyXMQ3cztp3v6p",
    size: '1x1',
    brightness: 100,
    contrast: 100,
    saturate: 100,
    objectPosition: '50% 50%',
    fit: 'cover',
    driveLink: "https://drive.google.com/file/d/1b7VxajPIQ49RBI7UaqwyXMQ3cztp3v6p/view?usp=sharing"
},

    // --- CHARACTER DESIGN SAMPLES ---
    {
        id: 10,
        title: "Character Concept A",
        type: 'character',
        imageUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=800&auto=format&fit=crop",
        size: '1x2',
    },
    {
        id: 11,
        title: "Character Concept B",
        type: 'character',
        imageUrl: "https://images.unsplash.com/photo-1620641788421-7f1c918e7464?q=80&w=800&auto=format&fit=crop",
        size: '2x2',
    },

    // --- TATTOO SAMPLES ---
    {
        id: 20,
        title: "Dragon Ink",
        type: 'tattoo',
        imageUrl: "https://images.unsplash.com/photo-1590246130793-1e96f1311091?q=80&w=800&auto=format&fit=crop",
        size: '1x2',
        filter: 'grayscale(100%) contrast(120%)',
    },
    {
        id: 21,
        title: "Floral Sleeve",
        type: 'tattoo',
        imageUrl: "https://images.unsplash.com/photo-1611593354354-969055486184?q=80&w=800&auto=format&fit=crop",
        size: '1x2',
        filter: 'grayscale(100%) contrast(120%)',
    },

    // --- ANIMATION SAMPLES ---
    {
        id: 30,
        title: "Walk Cycle",
        type: 'animation',
        imageUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExODk2bnZ4eGZ4am04eGZ4am04eGZ4am04eGZ4am04eGZ4am04eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LfpjDqLOcfSHu/giphy.gif",
        mediaType: 'video', // Using GIF as video placeholder
    },
    {
        id: 31,
        title: "Combat Combo",
        type: 'animation',
        imageUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnh6am04eGZ4am04eGZ4am04eGZ4am04eGZ4am04eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/13HBDT4QSTpveU/giphy.gif",
        mediaType: 'video',
    },
    {
        id: 32,
        title: "FX Test",
        type: 'animation',
        imageUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnh6am04eGZ4am04eGZ4am04eGZ4am04eGZ4am04eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ouZ753TTEWvLO/giphy.gif",
        mediaType: 'video',
    }
];

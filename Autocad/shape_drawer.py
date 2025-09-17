# shape_drawer.py (Cleaned and Corrected)

import re
import matplotlib
matplotlib.use('Agg')  # 💡 Prevent GUI/tkinter from causing issues in web server
import matplotlib.pyplot as plt
import numpy as np


def parse_instruction(instruction):
    instruction = instruction.lower().strip()

    if match := re.match(r"draw a circle of radius (\d+(?:\.\d+)?) at \((-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)\)", instruction):
        radius, x, y = float(match.group(1)), float(match.group(2)), float(match.group(3))
        return ('circle', x, y, radius)

    elif match := re.match(r"draw a horizontal line of length (\d+(?:\.\d+)?)", instruction):
        return ('h_line', 0, 0, float(match.group(1)))

    elif match := re.match(r"draw a vertical line of length (\d+(?:\.\d+)?)", instruction):
        return ('v_line', 0, 0, float(match.group(1)))

    elif match := re.match(r"draw a line from \(([^)]+)\) to \(([^)]+)\)", instruction):
        x1, y1 = map(float, match.group(1).split(','))
        x2, y2 = map(float, match.group(2).split(','))
        return ('line', x1, y1, x2, y2)

    elif match := re.match(r"draw a rectangle from \(([^)]+)\) to \(([^)]+)\)", instruction):
        x1, y1 = map(float, match.group(1).split(','))
        x2, y2 = map(float, match.group(2).split(','))
        return ('rectangle', x1, y1, x2, y2)

    elif match := re.match(r"draw an arc centered at \(([^)]+)\) with radius ([\d.]+) from ([\d.]+) to ([\d.]+) degrees", instruction):
        cx, cy = map(float, match.group(1).split(','))
        r, start, end = map(float, match.group(2, 3, 4))
        return ('arc', cx, cy, r, start, end)

    elif match := re.match(r"draw a polyline through (.+)", instruction):
        points = re.findall(r"\(([^)]+)\)", match.group(1))
        coords = [tuple(map(float, pt.split(','))) for pt in points]
        return ('polyline', coords)

    # Mechanical shapes (centered)
    elif match := re.match(r"draw a bolt of length ([\d.]+) and head diameter ([\d.]+)", instruction):
        return ('bolt_centered', float(match.group(1)), float(match.group(2)))

    elif match := re.match(r"draw a gear with (\d+) teeth and pitch diameter ([\d.]+)", instruction):
        return ('gear_centered', int(match.group(1)), float(match.group(2)))

    elif match := re.match(r"draw a flange of diameter ([\d.]+) with (\d+) holes", instruction):
        return ('flange_centered', float(match.group(1)), int(match.group(2)))

    elif match := re.match(r"draw a bearing with outer diameter ([\d.]+), inner diameter ([\d.]+), and width ([\d.]+)", instruction):
        return ('bearing_centered', float(match.group(1)), float(match.group(2)), float(match.group(3)))

    # Mechanical shapes (positioned)
    elif match := re.match(r"draw a bolt at \(([^)]+)\) with head diameter ([\d.]+) and shaft length ([\d.]+)", instruction):
        x, y = map(float, match.group(1).split(','))
        return ('bolt', x, y, float(match.group(2)), float(match.group(3)))

    elif match := re.match(r"draw a gear at \(([^)]+)\) with radius ([\d.]+) and (\d+) teeth", instruction):
        x, y = map(float, match.group(1).split(','))
        return ('gear', x, y, float(match.group(2)), int(match.group(3)))

    elif match := re.match(r"draw a flange at \(([^)]+)\) with radius ([\d.]+) and (\d+) holes", instruction):
        x, y = map(float, match.group(1).split(','))
        return ('flange', x, y, float(match.group(2)), int(match.group(3)))

    elif match := re.match(r"draw a bearing at \(([^)]+)\) with outer radius ([\d.]+) and inner radius ([\d.]+)", instruction):
        x, y = map(float, match.group(1).split(','))
        return ('bearing', x, y, float(match.group(2)), float(match.group(3)))

    else:
        raise ValueError("Unsupported instruction")


def draw_shape(command, save_path):
    fig, ax = plt.subplots()
    ax.set_aspect('equal')
    ax.axis('off')

    shape = command[0]

    if shape == 'circle':
        _, x, y, r = command
        ax.add_patch(plt.Circle((x, y), r, fill=False, color='black'))
        ax.set_xlim(x - r - 10, x + r + 10)
        ax.set_ylim(y - r - 10, y + r + 10)

    elif shape == 'h_line':
        _, x, y, length = command
        ax.plot([x, x + length], [y, y], color='black')
        ax.set_xlim(-10, length + 10)
        ax.set_ylim(-10, 10)

    elif shape == 'v_line':
        _, x, y, length = command
        ax.plot([x, x], [y, y + length], color='black')
        ax.set_xlim(-10, 10)
        ax.set_ylim(-10, length + 10)

    elif shape == 'line':
        _, x1, y1, x2, y2 = command
        ax.plot([x1, x2], [y1, y2], color='black')
        ax.set_xlim(min(x1, x2) - 10, max(x1, x2) + 10)
        ax.set_ylim(min(y1, y2) - 10, max(y1, y2) + 10)

    elif shape == 'rectangle':
        _, x1, y1, x2, y2 = command
        ax.add_patch(plt.Rectangle((x1, y1), x2 - x1, y2 - y1, fill=False, color='black'))
        ax.set_xlim(min(x1, x2) - 10, max(x1, x2) + 10)
        ax.set_ylim(min(y1, y2) - 10, max(y1, y2) + 10)

    elif shape == 'arc':
        _, cx, cy, r, start, end = command
        angles = np.linspace(start, end, 100)
        x = cx + r * np.cos(np.radians(angles))
        y = cy + r * np.sin(np.radians(angles))
        ax.plot(x, y, color='black')
        ax.set_xlim(cx - r - 10, cx + r + 10)
        ax.set_ylim(cy - r - 10, cy + r + 10)

    elif shape == 'polyline':
        _, points = command
        xs, ys = zip(*points)
        ax.plot(xs, ys, color='black')
        ax.set_xlim(min(xs) - 10, max(xs) + 10)
        ax.set_ylim(min(ys) - 10, max(ys) + 10)

    elif shape == 'bolt_centered':
        _, length, head_dia = command
        ax.plot([0, 0], [0, length], color='black')
        ax.add_patch(plt.Circle((0, length + head_dia / 2), head_dia / 2, fill=False, color='black'))
        ax.set_xlim(-head_dia, head_dia)
        ax.set_ylim(-10, length + head_dia + 10)

    elif shape == 'bolt':
        _, x, y, diameter, length = command
        ax.add_patch(plt.Circle((x, y), diameter / 2, fill=False, color='black'))
        ax.plot([x, x], [y - diameter / 2, y - diameter / 2 - length], color='black')
        ax.set_xlim(x - diameter, x + diameter)
        ax.set_ylim(y - diameter / 2 - length - 5, y + diameter)

    elif shape == 'gear_centered':
        _, teeth, pitch_dia = command
        radius = pitch_dia / 2
        ax.add_patch(plt.Circle((0, 0), radius, fill=False, color='black'))
        for i in range(teeth):
            angle = 2 * np.pi * i / teeth
            x = radius * np.cos(angle)
            y = radius * np.sin(angle)
            ax.plot([0, x], [0, y], color='black')
        ax.set_xlim(-radius - 10, radius + 10)
        ax.set_ylim(-radius - 10, radius + 10)

    elif shape == 'gear':
        _, x, y, radius, teeth = command
        angles = np.linspace(0, 2 * np.pi, teeth * 2, endpoint=False)
        r_mod = [radius if i % 2 == 0 else radius * 0.8 for i in range(len(angles))]
        xs = x + np.array(r_mod) * np.cos(angles)
        ys = y + np.array(r_mod) * np.sin(angles)
        xs = np.append(xs, xs[0])
        ys = np.append(ys, ys[0])
        ax.plot(xs, ys, color='black')
        ax.set_xlim(x - radius - 5, x + radius + 5)
        ax.set_ylim(y - radius - 5, y + radius + 5)

    elif shape == 'flange_centered':
        _, dia, holes = command
        ax.add_patch(plt.Circle((0, 0), dia / 2, fill=False, color='black'))
        for i in range(holes):
            angle = 2 * np.pi * i / holes
            x = (dia / 2 - 5) * np.cos(angle)
            y = (dia / 2 - 5) * np.sin(angle)
            ax.add_patch(plt.Circle((x, y), 2, fill=False, color='black'))
        ax.set_xlim(-dia / 2 - 10, dia / 2 + 10)
        ax.set_ylim(-dia / 2 - 10, dia / 2 + 10)

    elif shape == 'flange':
        _, x, y, radius, holes = command
        ax.add_patch(plt.Circle((x, y), radius, fill=False, color='black'))
        for i in range(holes):
            angle = 2 * np.pi * i / holes
            hx = x + (radius - 3) * np.cos(angle)
            hy = y + (radius - 3) * np.sin(angle)
            ax.add_patch(plt.Circle((hx, hy), 1.0, fill=False, color='black'))
        ax.set_xlim(x - radius - 5, x + radius + 5)
        ax.set_ylim(y - radius - 5, y + radius + 5)

    elif shape == 'bearing_centered':
        _, outer_dia, inner_dia, _ = command
        ax.add_patch(plt.Circle((0, 0), outer_dia / 2, fill=False, color='black'))
        ax.add_patch(plt.Circle((0, 0), inner_dia / 2, fill=False, color='black'))
        ax.set_xlim(-outer_dia / 2 - 10, outer_dia / 2 + 10)
        ax.set_ylim(-outer_dia / 2 - 10, outer_dia / 2 + 10)

    elif shape == 'bearing':
        _, x, y, outer_r, inner_r = command
        ax.add_patch(plt.Circle((x, y), outer_r, fill=False, color='black'))
        ax.add_patch(plt.Circle((x, y), inner_r, fill=False, color='black'))
        ax.set_xlim(x - outer_r - 5, x + outer_r + 5)
        ax.set_ylim(y - outer_r - 5, y + outer_r + 5)

    plt.savefig(save_path, bbox_inches='tight')
    plt.close()

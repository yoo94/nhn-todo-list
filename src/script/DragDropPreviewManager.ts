class DragDropPreviewManager {
    private draggingElement: HTMLElement | null = null;
    private draggingElementLocator: HTMLElement | null = null;
    private previewTimeout: number | null = null;

    setDraggingElements(draggingElement: HTMLElement | null, draggingElementLocator: HTMLElement | null) {
        this.draggingElement = draggingElement;
        this.draggingElementLocator = draggingElementLocator;
    }
    setPreview() {
        if (this.draggingElement) {
            if (this.draggingElementLocator && this.draggingElementLocator.parentNode) {
                const dragging = this.draggingElement;
                dragging.style.display = 'none';
                const todoList = document.getElementById('todo-list') as HTMLElement;
                if (dragging && todoList) {
                    const clonedElement = dragging.cloneNode(true) as HTMLElement;
                    // 원래 요소의 스타일을 복제하여 적용
                    const rect = dragging?.getBoundingClientRect();
                    // 마우스 위치 - 선택한 요소의 위치를 계산하여 초기 위치 저장
                    clonedElement.style.width = `${rect.width}px`;
                    clonedElement.style.height = `${rect.height}px`;
                    // 기존의 draggingElementLocator 내용을 대체
                    this.draggingElementLocator.innerHTML = clonedElement.innerHTML;
                }
            }
        }
    }
    schedulePreview() {
        if (this.previewTimeout) {
            clearTimeout(this.previewTimeout);
        }
        this.previewTimeout = window.setTimeout(() => {
            this.setPreview();
        }, 2000);
    }
    clearPreviewTimeout() {
        if (this.previewTimeout) {
            clearTimeout(this.previewTimeout);
            this.previewTimeout = null;
        }
    }
}

export default DragDropPreviewManager;

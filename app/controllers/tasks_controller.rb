class TasksController < ApplicationController
  before_action :find_task, only: %i[show edit destroy]
  def index
    @tasks = Task.all
  end

  def show
    # @task = Task.find(params[:id])
  end

  def new
    @task = Task.new
  end

  def create
    @task = Task.new(task_params)
    @task.new
    if @task.save
      redirect_to @tasks
    else
      render :new
    end
  end

  def edit
    # @task = Task.find(params[:id])
  end

  def update
    if @task.update
      redirect_to
    else
      render :edit
  end

  def destroy
    # @task = Task.find(params[:id])
    @task.destroy
  end

  private

  def find_task
    @task = Task.find(params[:id])
  end

  def task_params
    params.require(:task).permit(:name, :start_at, :end_at, :due, :category, :user)
  end
end
